var express = require('express'),
    app = express()
  , uuid=require('node-uuid')
  , mysql=require('mysql')
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

io.set('transports', [ 'htmlfile', 'xhr-polling', 'jsonp-polling' ]);

// listen for new web clients:
server.listen(63924);

app.use(express.static(__dirname+'/public'));

var userdbPool=mysql.createPool({
  host:'127.0.0.1',
  port:'3306',
  user:'root',
  password:'pw',
  database:'chess',
});

var activeClients = 0;
var roominc=0;

var Board = require('./public/js/board.js');
myBoard = new Board();
for(var y = 0; y < 14; y++){
  for(var x = 0; x < 14; x++){
    if(myBoard.board[y][x] != -1 && myBoard.board[y][x] != -2){
      myBoard.board[y][x].x = x;
      myBoard.board[y][x].y = y;
    }
  }
}

var Room=require('./public/js/room.js');
var rooms={};

io.sockets.on('connection',function(socket){
  activeClients +=1;
  io.sockets.emit('message', {clients:activeClients});
  socket.on('disconnect', clientDisconnect);

  socket.on('sendPosition',setPosition);
  
  socket.on('createroom', function(title, description, color){
      createRoom(title, description,color, socket);
  });
  socket.on('joinroom', function(id, color){
      joinRoom(id,color, socket);
  });

  socket.on('connect syn', function(){
    socket.join('lobby');
    socket.emit('connect ack');
  })

  socket.on('getGame', function(){
    socket.emit('message', io.sockets.manager.roomClients[socket.id]);
    //io.sockets.emit("name", players[socket.id].name);
    //io.sockets.emit('message', socket.id);
    //io.sockets.in(id).emit('message', rooms[id]);
  });
  socket.on('getBoard', function(){
    socket.emit('sendBoard', myBoard.exportBoard());
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
      connection.query("SELECT name FROM users WHERE id=?",[id], function(err, result){
        if(result[0]){
          connection.query("UPDATE users SET socket=? WHERE id=?",[socket.id, id], function(err, result){});
          socket.emit('name', result[0].name, id);
        }
        connection.release();
      });
    });
}

function setPosition(oldPos, newPos, figureIndex){
    console.log("oldx: "+oldPos.x+" oldy: "+oldPos.y+ " newX: "+newPos.x+ " newY: "+newPos.y);
    if(myBoard.isPossibleToMove(oldPos, newPos)){
        //look if another a figure is already on the tile
        if(myBoard.isFigure(newPos.x, newPos.y)){
            myBoard.board[newPos.y][newPos.x] = -1;
        }
        myBoard.moveFigureTo(oldPos.x, oldPos.y,newPos.x,newPos.y);

        if(myBoard.isEnPassant()){
            myBoard.board[newPos.y][newPos.x] = -1;
        }

        io.sockets.emit('setPosition',newPos, figureIndex);
    }
}

function joinRoom(id,color, socket){
  socket.leave('lobby');
  socket.join(id);
  rooms[id].addPerson(socket.id, color);
  socket.emit('roomjoined');
  io.sockets.in(id).emit('popul inc', id);
}

function createRoom(title, description,color, socket){
  socket.emit('message', socket.id);
  rooms[roominc]=new Room(title, description, socket.id);
  rooms[roominc].addPerson(socket.id, color);
  userdbPool.getConnection(function(err, connection){
    connection.query("SELECT name FROM users WHERE socket=?", [socket.id], function(err, result){
      if(result[0]){
        console.log(roominc);
        rooms[roominc].owner=result[0].name;
        io.sockets.in('lobby').emit('roomcreated', rooms[roominc], roominc);
        joinRoom(roominc, color, socket);
        roominc++;
      };
      connection.release();
    });
  });
}

function newPerson(name, socket){
  var id=uuid.v4();
  userdbPool.getConnection(function(err, connection){
    connection.query("insert into users (id, name, socket) VALUES (?, ?, ?)",[id, name, socket.id], function(err, result){
      connection.release();
    });
  });
  socket.emit('name', name, id);
}
 
function clientDisconnect(){
  activeClients -=1;
  io.sockets.emit('message', {clients:activeClients});
}