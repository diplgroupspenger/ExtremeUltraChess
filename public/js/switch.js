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
          socket.emit('createroom', $('#title').val(), $('#description').val(), true);
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
  lobby(socket);
  $('#debutton').on('click', function() {
    socket.emit('startgame');
  });
}

function toGame(socket, color) {
  $('#lobby').hide();
  $('#sublobby').hide();
  $('#game').show();
  $('#list1').val('');
  //$('#chat').hide();
  $('#chatlog').empty();
  startgame(socket, color);
}

function toSublobby(socket, color) {
  $('#lobby').hide();
  $('#game').hide();
  $('#chat').show();
  $('#sublobby').show();
  sublobby(socket, color);
}

function toLobby() {
  $('#game').hide();
  $('#sublobby').hide();
  $('#chat').show();
  $('#lobby').show();
  lobby(socket);
}