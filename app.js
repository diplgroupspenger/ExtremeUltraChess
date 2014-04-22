var express = require('express'),
  config = require('./config'),
  app = express(),
  uuid = require('node-uuid'),
  mysql = require('mysql'),
  http = require('http'),
  server = http.createServer(app),
  io = require('socket.io').listen(server);

io.set('transports', ['htmlfile', 'xhr-polling', 'jsonp-polling']);

// listen for new web clients:
server.listen(63924);

app.use(express.static(__dirname + '/public'));

var userdbPool = mysql.createPool(config.database);

var activeClients = 0;

var Board = require('./public/js/board.js');
var Turn = require('./public/js/turn.js');
var FigureType = require('./public/js/figureType.js');
var Figure = require('./public/js/figure.js');
var Color = require('./public/js/color.js');

//DEBUG
var turnOn = true;
var ignPossible = false;
//ENDDEBUG

var boards = {};

io.sockets.on('connection', function(socket) {
  socket.json.emit('syncRooms', generateAllRoomJson());

  socket.on('updateCheckedTiles', function() {
    updateCheckedTiles(socket);
  });

  socket.on('disconnect', function() {
    clientDisconnect(socket);
  });

  socket.on('sendPosition', function(oldPos, newPos, figureIndex, color) {
    if (isValid(oldPos) && isValid(newPos) && isValid(figureIndex) && isValid(color)) {
      setPosition(oldPos, newPos, figureIndex, color, socket);
    }
  });

  socket.on('convertPawn', function(figure, x, y) {
    if (isValid(figure) && isValid(x) && isValid(y)) {
      convertPawn(figure, x, y, socket);
    }
  });

  socket.on('createroom', function(title, description, password) {
    if (isValid(title) && isValid(description))
      createRoom(title, description, password, socket);
  });

  socket.on('joinroom', function(id, pw) {
    if (isValid(id)) {
      joinRoom(id, socket, pw);
    }
  });

  socket.on('connect syn', function() {
    socket.join('lobby');
    socket.emit('connect ack');
  });

  socket.on('sendMessage', function(text) {
    console.log("notsent");
    if (!isBlank(text)) {
      console.log("send");
      var name = socket.username;
      var room = getRoomFromSocket(socket);
      var roomName = room.substring(1);
      socket.broadcast.to(roomName).emit('setMessage', text, name);
    }
  });

  socket.on('getGame', function() {
    socket.emit('message', io.sockets.manager.roomClients[socket.id]);
  });
  socket.on('getBoard', function() {
    console.log('GETBOARD');
    room = getRoomFromSocket(socket);
    //console.log("room: " + room);
    //console.log("board: " + boards[room]);
    socket.emit('sendStatus', boards[room].exportBoard(), boards[room].turn.exportTurn());
  });
  socket.on('getname', function(id) {
    getName(id, socket);
  });
  socket.on('newplayer', function(name) {
    newPerson(name, socket);
  });
  socket.on('leave', function() {
    leaveRoom(socket);
  });

  //DEBUG
  socket.on('sendTurnStatus', function(turn) {
    if (isValid(turn)) {
      turnOn = turn;
    }
  });
  socket.on('sendPossibleStatus', function(possible) {
    if (isValid(possible)) {
      ignPossible = possible;
    }
  });


  socket.on('startgame', function() {
    var id = getRoomFromSocket(socket).substring(1);
    addBoard(id);
    io.sockets. in (id).emit('startgame');
  });


});

function updateCheckedTiles(socket) {

}

function getName(id, socket) {
  userdbPool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query("SELECT name FROM users WHERE id=?", [id], function(err, result) {
      if (err) throw err;
      if (result[0]) {
        connection.query("UPDATE users SET socket=? WHERE id=?", [socket.id, id], function(err, result) {
          if (err) throw err;
        });
        socket.username = result[0].name;
        socket.emit('name', result[0].name, id);
      } else {
        socket.emit("error", {
          type: 'nameerror',
          msg: 'We were not able to retrieve your name, reload the page or enter a new name.'
        });
      }
      connection.release();
    });
  });
}

function getRoomFromSocket(socket) {
  var rooms = io.sockets.manager.roomClients[socket.id];
  for (var key in rooms) {
    if (key.charAt(0) == '/') {
      return key;
    }
  }
}

function setPosition(oldPos, newPos, figureIndex, color, socket) {
  console.log("oldX: " + oldPos.x + " oldY: " + oldPos.y);
  var room = getRoomFromSocket(socket);
  if (boards[room].isLegalTile(oldPos.x, oldPos.y) && boards[room].isLegalTile(newPos.x, newPos.y)) {
    if (!turnOn || color == boards[room].turn.curPlayer.color) {
      if (boards[room].isPossibleToMove(oldPos, newPos) || ignPossible) {
        //look if another figure is already on the tile
        if (boards[room].isFigure(newPos.x, newPos.y)) {

          if (boards[room].board[newPos.y][newPos.x].type == FigureType.KING) {
            var figureColor = boards[room].board[newPos.y][newPos.x].color;
            boards[room].turn.remove(figureColor);
          }
          boards[room].board[newPos.y][newPos.x] = -1;
        }
        boards[room].moveFigureTo(oldPos.x, oldPos.y, newPos.x, newPos.y);


        if (boards[room].isEnPassant()) {
          boards[room].board[newPos.y][newPos.x] = -1;
        }

        if (!checkForPawnConvertion(boards[room].board[newPos.y][newPos.x].type, newPos)) {
          boards[room].turn.nextTurn();
        }
        var roomName = room.substring(1, room.length);
        io.sockets. in (roomName).emit('setPosition', newPos, figureIndex, true);
        boards[room].initCheckedTiles();
        io.sockets. in (roomName).emit('updateCheckedTiles', boards[room].checkedTiles);
        return;
      }
    }
  }
  //if the turn is not valid (because the client manipulated the game) the figure is reset to it's oldPos
  socket.emit('setPosition', oldPos, figureIndex, false);
}

function checkForPawnConvertion(type, pos) {
  if (type === FigureType.PAWN) {
    if (pos.y === 0) {
      return true;
    }
  }
  return false;
}

function convertPawn(figure, posX, posY, socket) {
  //console.log(figure);
  var room = getRoomFromSocket(socket);
  if (boards[room].board[posY][posX].type === FigureType.PAWN) {
    if (posY === 0) {
      boards[room].board[posY][posX] = new Figure(FigureType[figure.type.name], figure.color);
      //console.log("board: " + boards[room].board);
      boards[room].board[posY][posX].setPosition(posX, posY, boards[room]);
      boards[room].turn.nextTurn();
    }
  }
}

function joinRoom(id, socket, pw) {
  if (!io.rooms[('/' + id)][1].details.password || io.rooms[('/' + id)][1].details.password == pw) {
    var availableColors = io.rooms[('/' + id)][1].details.colors.length;
    if (availableColors > 0) {
      socket.leave('lobby');
      socket.join(id);

      colornum = Math.floor(Math.random() * (io.rooms[('/' + id)][1].details.colors.length));
      if (io.rooms[('/' + id)].length - 1 === 1) {
        colornum = 0; // DEBUG - REMOVE IN FINAL!!!!!!
      }
      userdbPool.getConnection(function(err, connection) {
        connection.query('SELECT id from users where socket=?', [socket.id], function(err, result) {
          if (result[0]) {
            socket.emit('roomjoined', io.rooms[('/' + id)][1].details.colors[colornum]);
            io.sockets. in ('lobby').emit('popul inc', id);
            io.sockets. in (id).emit('more people', {
              'name': socket.username,
              'color': io.rooms[('/' + id)][1].details.colors[colornum]
            });
            socket.color = io.rooms[('/' + id)][1].details.colors[colornum];
            var players = [];
            for (i = 0; i < io.sockets.clients(id).length; i++) {
              if (io.sockets.clients(id)[i].username && io.sockets.clients(id)[i].color) {
                players.push({
                  'name': io.sockets.clients(id)[i].username,
                  'color': io.sockets.clients(id)[i].color
                });
              }
            }
            socket.emit('subinit', players);
            connection.query('INSERT into roomusers (user, room, color) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE room=?, color=?', [result[0].id, id, io.rooms[('/' + id)][1].details.colors[colornum], id, io.rooms[('/' + id)][1].details.colors[colornum]], function(err) {
              io.rooms[('/' + id)][1].details.colors.splice(colornum, 1);
              if (io.rooms[('/' + id)][1].details.colors.length == 0) {
                addBoard(id);
                io.sockets. in (id).emit('startgame');
              }
              connection.release();
            });
          }
        });
      });
    } else {
      socket.emit("error", {
        type: id + 'error',
        msg: 'This room is already full'
      });
    }
  }
}

function createRoom(title, description, password, socket) {
  var roomid = 0;
  if (title) {
    userdbPool.getConnection(function(err, connection) {
      connection.query("SELECT id, name FROM users WHERE socket=?", [socket.id], function(err, result) {
        if (err) throw err;
        if (result[0]) {
          connection.query("CALL insertgetid(?, ?, ?)", [title, description, result[0].id], function(err, idresult) {
            if (idresult[0][0].id) {
              roomid = idresult[0][0].id;
              socket.join(roomid);

              io.rooms[('/' + roomid)].push({
                "details": {
                  "id": roomid,
                  "title": title,
                  "description": description,
                  "owner": socket.id,
                  "password": password
                }
              });
              io.rooms[('/' + roomid)][1].details.colors = [100, 200, 300, 400];

              io.rooms[('/' + roomid)][1].details.owner = result[0].name;
              joinRoom(roomid, socket, password);
              io.sockets. in ('lobby').emit('roomcreated', generateOneRoomJson(roomid));
              roomid++;
              connection.release();
            }
          });
        } else {
          connection.release();
        }
      });
    });
  } else {
    socket.emit("error", {
      type: 'openerror',
      msg: 'You have to enter a title for the room!'
    });
  }
}


function newPerson(name, socket) {
  if (!socket.username) {
    var id = uuid.v4();
    if (!name) {
      socket.emit("error", {
        type: 'nameerror',
        msg: 'You have to enter a name!'
      });
    } else if (name.length > 45) {
      socket.emit("error", {
        type: 'nameerror',
        msg: 'The maximum length of the name is 45 letters!'
      });
    } else {
      userdbPool.getConnection(function(err, connection) {
        if (err) throw err;
        connection.query("select socket from users where name=?", [name], function(err, result) {
          if (err) throw err;
          if (result[0]) {
            socket.emit("error", {
              type: 'nameerror',
              msg: 'This name is already in use. Please try a different one.'
            });
            connection.release();
          } else {
            connection.query("insert into users (id, name, socket) VALUES (?, ?, ?)", [id, name, socket.id], function(err, result) {
              if (err) throw err;
              socket.username = name;
              socket.emit('name', name, id);
              connection.release();
            });
          }
        });
      });
    }
  }
}

function addBoard(roomid) {
  var newBoard = new Board();
  newBoard.initCheckedTiles();
  for (var y = 0; y < newBoard.board.length; y++) {
    for (var x = 0; x < newBoard.board[0].length; x++) {
      if (newBoard.board[y][x] !== -1 && newBoard.board[y][x] !== -2) {
        newBoard.board[y][x].setPositionRelentless(x, y);
      }
    }
  }
  boards[('/' + roomid)] = newBoard;
  boards[('/' + roomid)].turn = new Turn();
}

function clientDisconnect(socket) {
  activeClients -= 1;
  io.sockets.emit('message', {
    clients: activeClients
  });
}

function leaveRoom(socket) {
  userdbPool.getConnection(function(err, connection) {
    connection.query('select * from roomusers where user=(select id from users where socket=?)', [socket.id], function(err, result) {
      if (result[0]) {
        if (io.rooms[('/' + result[0].room)].length == 2) {
          io.sockets. in ('lobby').emit('roomclosed', result[0].room);
        }
        socket.emit('message', result[0].room);
        socket.leave(result[0].room);
        socket.join('lobby');
        socket.json.emit('syncRooms', generateAllRoomJson());
      }
      connection.release();
    });
  });
}

//For checking if a string is blank, null or undefined
function isBlank(str) {
  return (!str || /^\s*$/.test(str) || typeof str !== "string");
}

function isValid(par) {
  return typeof par !== "undefined" && par !== null;
}

function generateOneRoomJson(roomid) {
  var retjson = JSON.parse(JSON.stringify(io.rooms[('/' + roomid)][1].details));
  delete retjson['password'];
  return retjson;
}

function generateAllRoomJson() {
  var rooms = JSON.parse(JSON.stringify(io.rooms));
  for (var key in rooms) {
    if (rooms[key][1]) {
      if (rooms[key][1].details) {
        if (rooms[key][1].details.password) {
          rooms[key][1].details.needpw = true;
        }
        delete rooms[key][1].details['password'];
      }
    }
  }
  return rooms;
}
