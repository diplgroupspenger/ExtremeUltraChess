var socket;

function execjs(){		
    socket = io.connect();
    lobby(socket);
}

function toGame(socket, color){
	$('#lobby').toggle();
	$('#game').toggle();

	startgame(socket, color);
}

function toLobby(){

}