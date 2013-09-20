var express = require('express'),
    app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);


io.set('transports', [ 'htmlfile', 'xhr-polling', 'jsonp-polling' ]);


// listen for new web clients:
server.listen(4000);

app.use(express.static(__dirname+'/public'));
 
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