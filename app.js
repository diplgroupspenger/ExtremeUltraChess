var express = require('express'),
    app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

io.set('transports', [ 'htmlfile', 'xhr-polling', 'jsonp-polling' ]);

// listen for new web clients:
server.listen(4000);

app.use(express.static(__dirname+'/public'));
  
var activeClients = 0;
var roominc=0;

var Board = require('./public/js/board.js');

serverBoard = new Board();
for(var y = 0; y < 14; y++){
  for(var x = 0; x < 14; x++){
    if(serverBoard.board[y][x] != -1 && serverBoard.board[y][x] != -2){
      serverBoard.board[y][x].x = x;
      serverBoard.board[y][x].y = y;
    }
  }
}

io.sockets.on('connection',function(socket){
  activeClients +=1;
  io.sockets.emit('message', {clients:activeClients});
  io.sockets.emit('sendBoard', serverBoard.exportBoard());
  socket.on('disconnect', clientDisconnect);

  socket.on('sendPosition',function(pos, figure){
      io.sockets.emit('setPosition',pos, figure);
  });
  
  socket.on('sendRemoveFigure',function(index){
      io.sockets.emit('removeFigure',index);
  });
  socket.on('createroom', function(description){
      createRoom(description, socket);
  });
  socket.on('joinroom', function(description){
      joinRoom(description, socket)
  });
});

function joinRoom(description, socket){
  socket.join(description);
  io.sockets.emit('roomjoined', description);
}

function createRoom(description, socket){
  socket.join(roominc);
  io.sockets.emit('roomcreated', roominc, description);
  roominc++;
}
 
function clientDisconnect(){
  activeClients -=1;
  io.sockets.emit('message', {clients:activeClients});
}

