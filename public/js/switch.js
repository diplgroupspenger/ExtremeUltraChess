var socket;

function execjs() {
  socket = io.connect();
  var openname = false;
  if (!localStorage.id) {
    openname = true;
  }
  $('#name-dialog').dialog({
    autoOpen: openname,
    height: 250,
    width: 300,
    modal: true,
    draggable: false,
    closeOnEscape: false,
    resizable: false,
    dialogClass: 'no-close',
    buttons: {
      "accept": {
        text: "accept",
        id: "acceptname",
        click: function() {
          socket.emit('newplayer', $('#nameinput').val());
        }
      }
    }
  });
  $("#openroom")
    .button()
    .click(function() {
      $("#open-dialog").dialog("open");
    });
  $("#logout")
    .button()
    .click(function() {
      localStorage.id = '';
      window.location.reload();
    });
  $("#open-dialog").dialog({
    autoOpen: false,
    height: 400,
    width: 450,
    modal: true,
    draggable: false,
    close: function(event, ui) {
      $('#openerror').text('');
      $('.openinput').val('');
    },
    buttons: {
      "accept": {
        text: "accept",
        id: "acceptopen",
        click: function() {
          socket.emit('createroom', $('#title').val(), $('#description').val(), $('#password').val(), true);
        }
      }
    }
  });
  $("#nameinput").keyup(function(event) {
    if (event.keyCode == 13) {
      $("#acceptname").focus();
      $("#acceptname").click();
    }
  });
  $("#title").keyup(function(event) {
    if (event.keyCode == 13) {
      $("#acceptopen").focus();
      $("#acceptopen").click();
    }
  });
  $("#password").keyup(function(event) {
    if (event.keyCode == 13) {
      $("#acceptopen").focus();
      $("#acceptopen").click();
    }
  });
  lobby(socket);
  $('#debutton').on('click', function() {
    socket.emit('turnTimeChanged', $("input[name='turnTimeSpinner']").val());
    socket.emit('startgame');
  });
}

function toGame(socket, color) {
  $('#lobby').hide();
  $('#sublobby').hide();
  $('#game').show();
  startgame(socket, color);
}

function toSublobby(socket, color, host, time) {
  $('#players').val('');
  $('#lobby').hide();
  $('#game').hide();
  $('#sublobby').show();
  $('#chatlog').empty();
  sublobby(socket, color, host, time);
}

function toLobby(socket) {
  $('#list1').text('');
  $('#game').hide();
  $('#sublobby').hide();
  $('#lobby').show();
  $('#chatlog').empty();
  lobby(socket);
}