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
    var newroom = "<li id='" + room.id +
      "' class='room'><span class='title'></span><span class='usercount'><span id='" +
      room.id + "count'></span>/4</span><br/><span class='description'></span><span class='owner'>" +
      room.owner + "</span><div class='details'><button class='join' id=" +
      room.id + ">join</button>";
    if (room.needpw) {
      newroom = newroom + "<input placeholder='Password' class='joinpw' type='password' id='pw" +
        room.id + "'/>";
    }
    newroom = newroom + "<label class='errormsg' id='" +
      room.id + "error'></label></div></li>";
    $('#list1').append(newroom);
    $('#' + room.id).children(".title").text(room.title);
    $('#' + room.id + 'count').text((4 - room.colors.length));
    $('#' + room.id).children(".description").text(room.description);
    $('#' + room.id).children(".owner").text(room.owner);
    $("li").off('click').on("click", function() {
      $(this)
        .toggleClass("open")
        .find(".details")
        .slideToggle();
    });
    $('.joinpw').off('click').on('click', function(e) {
      e.stopPropagation();
    });
    $("button.join").off('click').on("click", function(e) {
      e.stopPropagation();
      if ($('#pw' + $(this).attr('id')).length > 0) {
        socket.emit('joinroom', $(this).attr('id'), $('#pw' + $(this).attr('id')).val());
      } else {
        socket.emit('joinroom', $(this).attr('id'));
      }
    });
  };

  function showerror(error) {
    if (error.type == 'nameerror') {
      $('#name-dialog').dialog('open');
    }
    $('#' + error.type).text(error.msg);
  };
}