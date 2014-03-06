var socket;
function execjs(){
  socket = io.connect();
  $('#name-dialog').dialog({
    autoOpen: true,
    height: 250,
    width: 300,
    modal: true,
    draggable:false,
    closeOnEscape:false,
    resizable:false,
    dialogClass:'no-close',
    buttons: {
      "accept": function() {
        if($('#nameinput').val()){
          socket.emit('newplayer', $('#nameinput').val());
        }
      }
    }
  });
  lobby(socket);
}

function toGame(socket, color){
	$('#lobby').toggle();
	$('#game').toggle();
	$('#list1').val('');
  $('#chat').hide();
  $('#chatlog').empty();
	startgame(socket, color);
}

function toLobby(){
	$('#game').toggle();
	$('#lobby').toggle();
	lobby(socket);
}