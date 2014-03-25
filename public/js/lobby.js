function lobby(socket) {
  var opengames = [];
  var myname = "";

  socket.on('connect', function() {
    socket.emit('connect syn');
    socket.on('syncRooms', function(rooms) {
      console.log(rooms);
      for (var key in rooms) {
        if (rooms[key][1]) {
          if (rooms[key][1].details) {
            drawroom(rooms[key][1].details);
          }
        }
      }
    });
    socket.on('connect ack', function() {
      if (localStorage.id) {
        socket.emit('getname', localStorage.id);
      }
      socket.on('name', function(name, id) {
        myname = name;
        socket.username = name;
        localStorage.id = id;
        console.log(localStorage.id);
        $('#name').text(myname);
        $('#name-dialog').dialog('close');
        $('#nameerror').text('');
        initChat(socket);
      });
      socket.on('message', function(data) {
        console.log(data);
      });
      socket.on('roomcreated', function(newRoom) {
        console.log(newRoom);
        opengames.push(newRoom);
        drawroom(newRoom);
      });
      socket.on('init', function(rooms) {
        for (var i = 0; i < rooms.length; i++) {
          opengames.push(new Room(rooms[i], 'pre' + i, 'a'));
        }
        drawgames();
      });
      socket.on('popul inc', function(id) {
        $('#' + id + 'count').text(parseInt($('#' + id + 'count').text()) + 1);
      });
      socket.on('roomjoined', function(color) {
        $("#open-dialog").dialog("close");
        toSublobby(socket, color);
      });
      socket.on('roomclosed', function(id) {
        $('#' + id).remove();
      });
      socket.on('error', showerror);
    });
  });

  function drawroom(room) {
    $('#list1').append("<li id='" + room.id + "'><span class='title'>" + room.title + "</span><span class='usercount'><span id='" + room.id + "count'>" + (4 - room.colors.length) + "</span>/4</span><br/><span class='description'>" + room.description + "</span><span class='owner'>" + room.owner + "</span><div class='details'><button class='join'  id=" + room.id + ">Join</button><label class='errormsg' id='" + room.id + "error'></label></div></li>");
    $("li").off('click').on("click", function() {
      $(this)
        .toggleClass("open")
        .find(".details")
        .slideToggle();
    });
    $("button.join").off('click').on("click", function() {
      socket.emit('joinroom', $(this).attr('id'), true);
    });
  };

  function showerror(error) {
    if (error.type == 'nameerror') {
      $('#name-dialog').dialog('open');
    }
    $('#' + error.type).text(error.msg);
  };
}