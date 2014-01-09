var socket;

function execjs(){		
    socket = io.connect();
    lobby(socket);
}

function toGame(socket){
	$('#lobby').toggle();
	$('#canvas').toggle();
	startgame(socket);
}

function toLobby(){

}