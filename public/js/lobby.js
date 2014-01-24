function lobby(socket){                
        var opengames=[];
    var myname="";

    $('#createform').validate({
    	rules: {
    		title: {
    			required: true
    		}
    	},
    	submitHandler:function(form){
    		console.log('tut tut');
    	}
    });
    $('#nameform').validate({
    	rules: {
    		nameinput: {
    			required: true
    		}
    	},
    	submitHandler:function(form){
    		console.log('tut tut');
    	}
    });

	socket.on('connect', function(){
		socket.emit('connect syn');
		socket.on('syncRooms', function(rooms) {
			console.log(rooms.length);
			for (var i = 0; i < rooms.length; i++) {
				drawroom(rooms[i],i);
			}
		});
		socket.on('connect ack', function(){
			if(localStorage.id){
				socket.emit('getname', localStorage.id);
			};
			socket.on('name', function(name, id){
				console.log(name);
				myname=name;
				localStorage.id=id;
				console.log(localStorage.id);
				$('#name').text(myname);
				$('#name-dialog').dialog("close");
			});
			socket.on('message', function(data){
				console.log(data);
			});
			socket.on('roomcreated', function(newRoom, id){
				opengames[id]=newRoom;
				drawroom(newRoom, id);
			});
			socket.on('init', function(rooms){
				for (var i=0; i<rooms.length; i++){
					opengames.push(new Room(rooms[i], 'pre'+i, 'a'));
				}
				drawgames();
			});
			socket.on('roomjoined', function(color){
				toGame(socket, color);
				//$("#content").load("./index.html");
				//socket.emit('getGame', 1);
				//console.log(id);
			});
		});
	});
	function drawgames(){
		document.getElementById("list1").innerHTML='';
		for(var i=0; i<opengames.length; i++){
			drawroom(i, opengames[i].title, opengames[i].description, opengames[i].owner);
		}
		$("li").on("click", function() {
  			$(this)
    		.toggleClass("open")
			.find(".details")
			.slideToggle();
		});
		$("button.join").on("click", function(){
	  		socket.emit('joinroom', $(this).attr('id'));
		});
	}
	function drawroom(room, id){
		$('#list1').append("<li><span class='title'>"+room.title+"</span><span class='owner'>"+room.owner+"</span><div class='details'><p>"+room.description+"</p><button class='join'  id="+id+">Join</button></div></li>");
		$("li").off('click').on("click", function() {
  			$(this)
    		.toggleClass("open")
			.find(".details")
			.slideToggle();
		});
		$("button.join").off('click').on("click", function(){
	  		socket.emit('joinroom', $(this).attr('id'), true);
		});
	}
	$("#openroom")
      .button()
      .click(function() {
                $("#dialog-form").dialog("open");
        });
        $("#dialog-form").dialog({
      autoOpen: false,
      height: 300,
      width: 350,
      modal: true,
      draggable:false,
      buttons: {
        "accept": function() {
        	//document.forms['createform'].submit();
        	socket.emit('createroom',$('#title').val(), $('#description').val(),true);
        	$(this).dialog("close");
        }
      }
    });
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
        	//document.forms['nameform'].submit();
        	if($('#nameinput').val()){
        		socket.emit('newplayer', $('#nameinput').val());
        	}
        }
      }
    });
    $("#name-dialog").keydown(function (event) {
        if (event.keyCode == 13) {
            if($('#nameinput').val()){
                        socket.emit('newplayer', $('#nameinput').val());
                }
        }
 });
