function initChat(socket) {
  $('#postmsg').on('click', function() {
    var text = $('#msgInput').val();
    if (validText(text)) {
      setText(text, socket.username);
      socket.emit('sendMessage', text);
    }
    $('#msgInput').val('');
  });

  $('#msgInput').on("keypress", function(e) {
    if (e.keyCode === 13) {
      $('#postmsg').click();
    }
  });

  socket.on('setMessage', function(text, user) {
    setText(text, user);
  });
}

function setText(text, user) {
  console.log("Name: " + user);
  var $msg = $('<div>');
  $msg.append($('<span>').text(getTime()+" "));
  $msg.append($('<span>').text(user+":"));
  $msg.append($('<span>').text(text+" "));
  $('#chatlog').append($msg);
  $('#chatlog').scrollTop($('#chatlog')[0].scrollHeight);
}

function validText(str) {
  if (isBlank(str))
    return false;

  return true;
}

function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

function getTime() {
  var now = new Date();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  if (hour.toString().length == 1) {
    var hour = '0' + hour;
  }
  if (minute.toString().length == 1) {
    var minute = '0' + minute;
  }
  if (second.toString().length == 1) {
    var second = '0' + second;
  }
  return hour + ":" + minute + ":" + second;
}