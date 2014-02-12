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
var roominc = 0;

var Board = require('./public/js/board.js');
var Turn = require('./public/js/turn.js');
var FigureType = require('./public/js/figureType.js');
var Figure = require('./public/js/figure.js');
var Color = require('./public/js/color.js');

//DEBUG
var turnOn = true;
//ENDDEBUG

myBoard = new Board();
turn = new Turn();
for(var y = 0; y < myBoard.board.length; y++){
  for(var x = 0; x < myBoard.board[0].length; x++){
    if(myBoard.board[y][x] !== -1 && myBoard.board[y][x] !== -2){
      myBoard.board[y][x].setPosition(x, y);
    }
  }
}

var Room=require('./public/js/room.js');
var rooms=[];

io.sockets.on('connection',function(socket){
  
  socket.emit('syncRooms', rooms);
  socket.on('disconnect', function(socket) {
  console.log(io.sockets.manager.roomClients[socket.id]);
  });

  socket.on('sendPosition', setPosition);
  socket.on('convertPawn', convertPawn);
  socket.on('createroom', function(title, description, color){
      createRoom(title, description,color, socket);
  });
  socket.on('joinroom', function(id, color){
      joinRoom(id,color, socket);
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

  //DEBUG
  socket.on('sendTurnStatus', function(turn) {
    turnOn = turn;
  })
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
        console.dir(myBoard.board[newPos.y][newPos.x]);
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

function convertPawn(figure, posX, posY) {
    if(myBoard.board[posY][posX].type === FigureType.PAWN) {
        if(posY == 0){
            myBoard.board[posY][posX] = new Figure(FigureType[figure.type.name], figure.color);
            myBoard.board[posY][posX].setPosition(posX, posY);
        }
    }
}

function joinRoom(id,color, socket){
  var countPeople = rooms[id].people.length;
  if(countPeople < 4) {
    socket.leave('lobby');
    socket.join(id);

    infinite:
    while(true) {
        color = Math.floor((Math.random()*4)+1)*100;
        if(rooms[id].people.length === 0) {
          color = 100; // DEBUG - REMOVE IN FINAL!!!!!!
          break;
        }
        //count if it`s not equal to any color of the joined people
        var countColor = 0;
        for(var i = 0; i<rooms[id].people.length; i++) {
          console.log("color: "+color +" peoplecolor: "+rooms[id].people[i].color);
          if(color != rooms[id].people[i].color){
            countColor++;
            console.log("countColor+: "+countColor);
          }
          console.log("people: "+countPeople+" color: "+countColor);
          if(countColor == countPeople) {
            break infinite;
          }
        }
    }
    rooms[id].addPerson(socket.id, color);
    socket.emit('roomjoined', color);
    io.sockets.in(id).emit('popul inc', id);
  }
  else {
    console.log("room is full");
  }
}

function createRoom(title, description,color, socket){
  color = Math.floor((Math.random()*4)+1)*100;
  console.log("ROOMLENGTH: "+rooms.length);
  rooms[roominc]=new Room(title, description, socket.id);
  console.log("ROOMLENGTH2: "+rooms.length+ " title:"+rooms[roominc].title);
  //rooms[roominc].addPerson(socket.id, color);
  userdbPool.getConnection(function(err, connection){
    connection.query("SELECT name FROM users WHERE socket=?", [socket.id], function(err, result){
      if (err) throw err;
      if(result[0]){
        console.log(roominc);
        rooms[roominc].owner=result[0].name;
        io.sockets.in('lobby').emit('roomcreated', rooms[roominc], roominc);
        //joinRoom(roominc, color, socket);
        roominc++;
      }
      connection.release();
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