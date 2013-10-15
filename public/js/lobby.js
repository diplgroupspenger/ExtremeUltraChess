function execjs(){		
	var opengames=[];
    var socket = io.connect();
	socket.on('connect', function(){
		socket.on('message', function(data){
			console.log(data);
		});
		socket.on('roomcreated', function(roomname, roomdescription){
			opengames.push(new gameroom(roomname, roomdescription));
			drawgames();
		});
		socket.on('init', function(rooms){
			console.log(rooms/0);
			for (var i=0; i<rooms.length; i++){
				opengames.push(new gameroom(rooms[i], 'pre'+i));
			}
			drawgames();
		});
	});
	function drawgames(){
		document.getElementById("list1").innerHTML='';
		for(var i=0; i<opengames.length; i++){
			console.log(opengames[i]);
			drawroom(opengames[i].title, opengames[i].description);
		}
		$("li").on("click", function() {
  			$(this)
    		.toggleClass("open")
			.find(".details")
			.slideToggle();
		});
		$("button.join").bind("click", function(){
	  		socket.emit('joinroom', $(this).attr('id'))
		});
	}
	function drawroom(title, description){
		$('#list1').append("<li><span class='title'>"+title+"</span><div class='details'><p>"+description+"</p><button class='join'  id="+title+">Join</button></div></li>");
	}
	$( "#openroom" )
      .button()
      .click(function() {
        	$( "#dialog-form" ).dialog( "open" );
        });
	$( "#dialog-form" ).dialog({
      autoOpen: false,
      height: 300,
      width: 350,
      modal: true,
      draggable:false,
      buttons: {
        "accept": function() {
        	socket.emit('createroom', $('#description').val());
        	$( this ).dialog( "close" );
        }
      }
    });
}
