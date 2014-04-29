function sublobby(socket, color) {
  window.location = '#sublobby';
  socket.removeAllListeners('startgame');
  socket.removeAllListeners('more people');
  socket.removeAllListeners('subinit');
  socket.removeAllListeners('own user');
  socket.removeAllListeners('readychange');
  socket.on('startgame', game);
  socket.on('more people', drawplayer);
  socket.on('subinit', subInit);
  socket.on('own user', drawplayer);
  socket.on('readychange', readychange);

  function subInit(data) {
    $('#players').html('');
    for (i = 0; i < data.length; i++) {
      drawplayer(data[i]);
    }
  }

  function game() {
    toGame(socket, color);
  }

  function drawplayer(data) {
    var player = '<tr><td class=subname id="' + data.color + '"></td><td class="color' + data.color + '"></td><td><input id="' + data.color + 'ready" type="checkbox" ';
    if (!(data.own)) {
      player = player + 'disabled="disabled"';
    }
    player = player + '></td></tr>';
    $('#players').append(player);
    if (data.own) {
      $('#' + data.color + 'ready').change(function() {
        socket.emit('readychange', this.checked);
      });
    }
    $('#' + data.color).text(data.name);
  }

  function readychange(data) {
    $('#' + data.playercolor + 'ready').prop('checked', data.checked);
  }
}