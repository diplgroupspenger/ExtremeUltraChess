var express = require('express'),
    config = require('./config'),
    app = express(),
    uuid=require('node-uuid'),
    mysql=require('mysql'),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

io.set('transports', [ 'htmlfile', 'xhr-polling', 'jsonp-polling' ]);

// listen for new web clients:
server.listen(63924);

app.use(express.static(__dirname+'/public'));

var userdbPool = mysql.createPool(config.database);

var activeClients = 0;
var roominc = 0;

var Board = require('./public/js/board.js');
var Turn = require('./public/js/turn.js');
var FigureType = require('./public/js/figureType.js');
var Figure = require('./public/js/figure.js');
var Color = require('./public/js/color.js');

//DEBUG
var turnOn = true;
var ignPossible = false;
//ENDDEBUG

var boards = [];
var turn = new Turn();

io.sockets.on('connection',function(socket){
  console.log(io.rooms);
  socket.json.emit('syncRooms', io.rooms);
  socket.on('disconnect', clientDisconnect);

  socket.on('sendPosition',setPosition(oldPos, newPos, figureIndex, color, socket));
  socket.on('convertPawn', convertPawn);
  socket.on('createroom', function(title, description){
      createRoom(title, description, socket);
  });
  socket.on('joinroom', function(id){
      joinRoom(id, socket);
  });

  socket.on('connect syn', function(){
    socket.join('lobby');
    socket.emit('connect ack');
  });

  socket.on('getGame', function(){
    socket.emit('message', io.sockets.manager.roomClients[socket.id]);
    //io.sockets.emit("name", players[socket.id].name);
    //io.sockets.emit('message', socket.id);
    //io.sockets.in(id).emit('message', rooms[id]);
  });
  socket.on('getBoard', function(){
    socket.emit('sendStatus', boards[id].exportBoard(), turn);
  });
  socket.on('getname', function(id){
    getName(id, socket);
  });
  socket.on('newplayer', function(name){
    newPerson(name, socket);
  });

  //DEBUG
  socket.on('sendTurnStatus', function(turn) {
    turnOn = turn;
  });
  socket.on('sendPossibleStatus', function(possible) {
    ignPossible = possible;
  });
});

function getName(id, socket){
  userdbPool.getConnection(function(err, connection){
    if(err) throw err;
    connection.query("SELECT name FROM users WHERE id=?",[id], function(err, result){
      if(err) throw err;
      if(result[0]){
        connection.query("UPDATE users SET socket=? WHERE id=?",[socket.id, id], function(err, result){
          if (err) throw err;
        });
        socket.username=result[0].name;
        socket.emit('name', result[0].name, id);
      }
      connection.release();
    });
  });
}

function setPosition(oldPos, newPos, figureIndex, color, socket){
  console.log("ROOM; "+io.sockets.manager.roomClients[socket.id]);
    console.log("possible: "+ignPossible);
  if(!turnOn || color == turn.curPlayer.color) {
    if(boards[id].isPossibleToMove(oldPos, newPos) || ignPossible){
      console.log("ignore");
      //look if another figure is already on the tile
      if(boards[id].isFigure(newPos.x, newPos.y)){
        console.dir(boards[id].board[newPos.y][newPos.x]);
          if(boards[id].board[newPos.y][newPos.x].type == FigureType.KING) {
            var figureColor = boards[id].board[newPos.y][newPos.x].color;
            turn.remove(figureColor);
          }
      
          boards[id].board[newPos.y][newPos.x] = -1;
      }
      boards[id].moveFigureTo(oldPos.x, oldPos.y,newPos.x,newPos.y);

      if(boards[id].isEnPassant()){
          boards[id].board[newPos.y][newPos.x] = -1;
      }
      
      if(!checkForPawnConvertion(boards[id].board[newPos.y][newPos.x].type, newPos)) {
        turn.nextTurn();
      }

      io.sockets.emit('setPosition', newPos, figureIndex, true);
      return;
    }
    
  }
  //if the turn is not valid (because the client manipulated the game) the figure is reset to it's oldPos
  io.sockets.emit('setPosition', oldPos, figureIndex, false);
}

function checkForPawnConvertion(type, pos) {
    if(type === FigureType.PAWN) {
        if(pos.y == 0){
            return true;
        }
    }
    return false;
}

function convertPawn(figure, posX, posY) {
    if(boards[id].board[posY][posX].type === FigureType.PAWN) {
        if(posY == 0){
            boards[id].board[posY][posX] = new Figure(FigureType[figure.type.name], figure.color);
            boards[id].board[posY][posX].setPosition(posX, posY, boards[id].board);
            turn.nextTurn();
        }
    }
}

function joinRoom(id, socket){
  var availableColors = io.rooms[('/'+id)][1].details.colors.length;
  if(availableColors > 0) {
    socket.leave('lobby');
    socket.join(id);

    colornum=Math.floor(Math.random()*(io.rooms[('/'+id)][1].details.colors.length));
    if(io.rooms[('/'+id)].length-1 === 1) {
      colornum = 0; // DEBUG - REMOVE IN FINAL!!!!!!
    }
    userdbPool.getConnection(function(err, connection){
      connection.query('SELECT id from users where socket=?', [socket.id], function(err, result){
        if(result[0]){
          socket.emit('roomjoined', io.rooms[('/'+id)][1].details.colors[colornum]);
          io.sockets.in(id).emit('popul inc', id);
          connection.query('INSERT into roomusers(user, room, color) VALUES(?, ?, ?)', [result[0], id, io.rooms[('/'+id)][1].details.colors[colornum]], function(err){
            io.rooms[('/'+id)][1].details.colors.splice(colornum, 1);
            connection.release();
          });
        }
      });
    });
  }
  else {
    console.log("room is full");
  }
}

function createRoom(title, description, socket){
  socket.join(roominc);
  console.log(io.rooms);
  io.rooms[('/'+roominc)].push({"details":{"id":roominc, "title":title, "description":description, "owner":socket.id}});
  io.rooms[('/'+roominc)][1].details.colors=[100, 200, 300, 400];
  //io.rooms[('/'+roominc)].details.title=title;
  //console.log("ROOMLENGTH2: "+io.sockets.rooms.length+ " title:"+io.sockets.rooms[roominc].title);
  userdbPool.getConnection(function(err, connection){
    connection.query("insert into rooms(roomid, title, description, owner) VALUES(?, ?, ?, ?)", [roominc, title, description, socket.id], function(err){
      connection.query("SELECT name FROM users WHERE socket=?", [socket.id], function(err, result){
        if(err) throw err;
        if(result[0]){
          console.log(roominc);
          io.rooms[('/'+roominc)][1].details.owner = result[0].name;
          joinRoom(roominc, socket);
          console.log(io.rooms);
          io.sockets.in('lobby').emit('roomcreated', io.rooms[('/'+roominc)][1].details);
          roominc++;
          addBoard(roominc);
        }
        connection.release();
      });
    });
  });
}

function addBoard(id) {
  boards[id] = new Board();
  for(var y = 0; y < boards[id].board.length; y++){
    for(var x = 0; x < boards[id].board[0].length; x++){
      if(boards[id].board[y][x] !== -1 && boards[id].board[y][x] !== -2){
        boards[id].board[y][x].setPositionRelentless(x, y);
      }
    }
  }
}

function newPerson(name, socket){
  var id = uuid.v4();

  userdbPool.getConnection(function(err, connection){
    if(err) throw err;
    connection.query("select socket from users where name=?", [name], function(err, result){
      if(err) throw err;
      if(result[0]){
        console.log('schon vorhanden');
        connection.release();
      }
      else{
        connection.query("insert into users (id, name, socket) VALUES (?, ?, ?)",[id, name, socket.id], function(err, result){
          if (err) throw err;
          socket.username=name;
          socket.emit('name', name, id);
          connection.release();
        });
      }
    });
  });
}
 
function clientDisconnect(){
  activeClients -= 1;
  io.sockets.emit('message', {clients:activeClients});
}