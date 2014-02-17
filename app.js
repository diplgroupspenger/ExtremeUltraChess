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

var userdbPool=mysql.createPool(config.database);

var activeClients = 0;
var roominc=0;

var Board = require('./public/js/board.js');
var Turn = require('./public/js/turn.js');
var FigureType = require('./public/js/figureType.js');
myBoard = new Board();
turn = new Turn();
for(var y = 0; y < myBoard.board.length; y++){
  for(var x = 0; x < myBoard.board[0].length; x++){
    if(myBoard.board[y][x] !== -1 && myBoard.board[y][x] !== -2){
      myBoard.board[y][x].x = x;
      myBoard.board[y][x].y = y;
    }
  }
}

var Room=require('./public/js/room.js');

io.sockets.on('connection',function(socket){
  console.log(io.rooms);
  socket.json.emit('syncRooms', io.rooms);
  socket.on('disconnect', clientDisconnect);

  socket.on('sendPosition',setPosition);
  
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
    socket.emit('sendStatus', myBoard.exportBoard(), turn);
  });
  socket.on('getname', function(id){
    getName(id, socket);
  });
  socket.on('newplayer', function(name){
    newPerson(name, socket);
  });

});

function getName(id, socket){
  userdbPool.getConnection(function(err, connection){
    if (err) throw err;
    connection.query("SELECT name FROM users WHERE id=?",[id], function(err, result){
      if (err) throw err;
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

function setPosition(oldPos, newPos, figureIndex, color){

  if(color == turn.curPlayer.color) {

    if(myBoard.isPossibleToMove(oldPos, newPos)){

      //look if another figure is already on the tile
      if(myBoard.isFigure(newPos.x, newPos.y)){
          if(myBoard.board[newPos.y][newPos.x].type == FigureType.KING) {
            var figureColor = myBoard.board[newPos.y][newPos.x].color;
            turn.remove(figureColor);
          }
      
          myBoard.board[newPos.y][newPos.x] = -1;
      }
      myBoard.moveFigureTo(oldPos.x, oldPos.y,newPos.x,newPos.y);

      if(myBoard.isEnPassant()){
          myBoard.board[newPos.y][newPos.x] = -1;
      }

      io.sockets.emit('setPosition', newPos, figureIndex, true);
      turn.nextTurn();
      return;
    }
    
  }
  //if the turn is not valid (because the client manipulated the game) the figure is reset to it's oldPos
  io.sockets.emit('setPosition', oldPos, figureIndex, false);
}

function joinRoom(id, socket){
  var countPeople = io.rooms[('/'+id)].length-1;
  if(countPeople < 4) {
    socket.leave('lobby');
    socket.join(id);

    //infinite:
    //while(true) {
        color = Math.floor((Math.random()*4)+1)*100;
        if(io.rooms[('/'+id)].length-1 === 1) {
          color = 100; // DEBUG - REMOVE IN FINAL!!!!!!
          //break;
        }
        //count if it`s not equal to any color of the joined people
        var countColor = 0;
        getUsedColors(id, function(usedColors){
          for(var i = 0; i<usedColors.length; i++) {
            //console.log("color: "+color +" peoplecolor: "+rooms[id].people[i].color);
            if(color != usedColors[i]){
              countColor++;
              //console.log("countColor+: "+countColor);
            }
            //console.log("people: "+countPeople+" color: "+countColor);
            if(usedColors.length == countPeople) {
              //break infinite;
            }
          }
        });
        userdbPool.getConnection(function(err, connection){
          connection.query('SELECT id from users where socket=?', [socket.id], function(err, result){
            if(result[0]){
            connection.query('INSERT into roomusers(user, room, color) VALUES(?, ?, ?)', [result[0], id, color], function(err){
              connection.release();
            });
            }
          });
        });
    //}
    //rooms[id].addPerson(socket.id, color);
    socket.emit('roomjoined', color);
    io.sockets.in(id).emit('popul inc', id);
  }
  else {
    console.log("room is full");
  }
}

function createRoom(title, description, socket){
  socket.join(roominc);
  console.log(io.rooms);
  io.rooms[('/'+roominc)].push({"details":{"id":roominc, "title":title, "description":description, "owner":socket.id}});
  //io.rooms[('/'+roominc)].details.title=title;
  //console.log("ROOMLENGTH2: "+io.sockets.rooms.length+ " title:"+io.sockets.rooms[roominc].title);
  userdbPool.getConnection(function(err, connection){
    connection.query("insert into rooms(roomid, title, description, owner) VALUES(?, ?, ?, ?)", [roominc, title, description, socket.id], function(err){
      connection.query("SELECT name FROM users WHERE socket=?", [socket.id], function(err, result){
        if (err) throw err;
        if(result[0]){
          console.log(roominc);
          io.rooms[('/'+roominc)][1].details.owner=result[0].name;
          joinRoom(roominc, socket);
          console.log(io.rooms);
          io.sockets.in('lobby').emit('roomcreated', io.rooms[('/'+roominc)][1].details);
          roominc++;
        }
        connection.release();
      });
    });
  });
}

function newPerson(name, socket){
  var id=uuid.v4();

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

function getUsedColors(roomid, callb){
  var colors=[];
  userdbPool.getConnection(function(err, connection){
    connection.query('select color from roomusers where room=?', [roomid], function(err, result){
      for(i=0; i<result.length; i++){
        if(result[0].color){
          colors.push(result[0].color);
        }
      }
      console.log('used colors: '+colors);
      callb(colors);
      connection.release();
    });
  });
}