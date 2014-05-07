function lobby(socket) {
  var opengames = [];
  var myname = "";

  socket.removeAllListeners('syncRooms');
  socket.removeAllListeners('connect ack');

  //socket.on('connect', function() {
  socket.on('syncRooms', function(rooms) {
    for (var key in rooms) {
      if (rooms[key][1]) {
        if (rooms[key][1].details) {
          drawroom(rooms[key][1].details);
        }
      }
    }
  });
  socket.on('connect ack', function() {
    socket.on('roomcreated', function(newRoom) {
      opengames.push(newRoom);
      drawroom(newRoom);
    });
    socket.on('message', function(data) {
      console.log(data);
    });
    socket.on('name', function(name, id) {
      myname = name;
      socket.username = name;
      localStorage.id = id;
      $('#name').text(myname);
      $('#name-dialog').dialog('close');
      $('#nameerror').text('');
      initChat(socket);
      initRules();
    });
    socket.on('popul inc', function(id) {
      $('#' + id + 'count').text(parseInt($('#' + id + 'count').text()) + 1);
    });
    socket.on('roomjoined', function(color, host, time) {
      $("#open-dialog").dialog("close");
      toSublobby(socket, color, host, time);
    });
    socket.on('roomclosed', function(id) {
      $('#' + id).remove();
    });
    socket.on('error', showerror);
    if (localStorage.id) {
      socket.emit('getname', localStorage.id);
    }
  });
  socket.emit('connect syn');
  //});

  function drawroom(room) {
    var newroom = "<li id='li" + room.id +
      "' class='room'><span class='title'></span><span class='usercount'><span id='" +
      room.id + "count'></span>/4</span><br/><span class='description'></span><span class='owner'>" +
      room.owner + "</span><div class='details'><button class='join btn btn-success btn-xs' id=" +
      room.id + ">join</button>";
    if (room.needpw) {
      newroom = newroom + "<input placeholder='Password' class='joinpw' type='password' id='pw" +
        room.id + "'/>";
    }
    newroom = newroom + "<label class='errormsg' id='" +
      room.id + "error'></label></div></li>";
    $('#list1').append(newroom);
    $('#li' + room.id).children(".title").text(room.title);
    $('#' + room.id + 'count').text((4 - room.colors.length));
    $('#li' + room.id).children(".description").text(room.description);
    $('#li' + room.id).children(".owner").text(room.owner);
    $("li").off('click').on("click", function() {
      $(this)
        .toggleClass("open")
        .find(".details")
        .slideToggle();
      $("#pw" + room.id).focus();
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
    $("#pw" + room.id).keyup(function(event) {
      if (event.keyCode == 13) {
        $("#" + room.id).focus();
        $("#" + room.id).click();
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