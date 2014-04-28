function initChat(socket) {
  $('#postmsg').on('click', function() {
    var text = $('#msgInput').val();
    if (validText(text)) {
      setText(text, socket.username);
      if(!isCommand(text)) {
        socket.emit('sendMessage', text);
      }
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

  socket.on('updateTotalPlayerCount', function(count) {
    $('#totalPlayerCount').text('Total players: ' + count);
  });

  socket.on('updateCurPlayerCount', function(count) {
    console.log('updatecurplayercont '+count);
    $('#curPlayerCount').text('Current online: ' + count);
  });

  socket.on('sendTotalPlayerList', function(list) {
    console.log(list);
    var string = [];
    $.each(list, function(key, val) {
      string.push(val.name);
    });
    setText(string.join(','),'Server');
  });
}

function setText(text, user) {
  console.log("Name: " + user);
  var $msg = $('<div>');
  $msg.append($('<span>').text(getTime()+" "));
  $msg.append($('<span>').text(user+": "));
  $msg.append($('<span style="max-width: 100%; word-wrap: break-word;">').text(text+""));
  $('#chatlog').append($msg);
  var heightoffset = $('#generalInfo').height();
  console.log($('#chatlog')[0].scrollHeight - heightoffset);
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

function isCommand(str) {
  if(str === "/userlist"){
    socket.emit('getPlayerList');
    return true;
  } 

  return false;
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