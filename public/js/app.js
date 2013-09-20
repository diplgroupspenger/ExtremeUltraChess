var app = require('express').createServer();
var io = require('socket.io').listen(app);
app.listen(4000);
 
app.get('/', function(request, response){
  response.sendfile(__dirname + "/index.html");
});
 
var activeClients = 0;
 
io.sockets.on('connection', function(socket){clientConnect(socket)});
 
function clientConnect(socket){
  activeClients +=1;
  io.sockets.emit('message', {clients:activeClients});
  socket.on('disconnect', function(){clientDisconnect()});
}
 
function clientDisconnect(){
  activeClients -=1;
  io.sockets.emit('message', {clients:activeClients});
}