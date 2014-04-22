function sublobby(socket, color) {
  socket.removeAllListeners('startgame');
  socket.removeAllListeners('more people');
  socket.removeAllListeners('subinit');
  socket.on('startgame', game);
  socket.on('more people', drawplayer);
  socket.on('subinit', subInit);

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
    $('#players').append('<tr><td class=subname id="' + data.color + '"></td><td class="color' + data.color + '"></td></tr>');
    $('#' + data.color).text(data.name);
  }
}