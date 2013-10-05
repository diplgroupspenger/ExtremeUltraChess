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
 
io.sockets.on('connection',function(socket){
  activeClients +=1;
  io.sockets.emit('message', {clients:activeClients});
  socket.on('disconnect', clientDisconnect);

  socket.on('sendPosition',function(pos, figure){
      io.sockets.emit('setPosition',pos, figure);
  });
  
  socket.on('sendRemoveFigure',function(index){
      io.sockets.emit('removeFigure',index);
  });
});
 
function clientDisconnect(){
  activeClients -=1;
  io.sockets.emit('message', {clients:activeClients});
}

