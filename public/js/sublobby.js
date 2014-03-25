function sublobby(socket, color) {
  socket.on('startgame', function() {
    toGame(socket, color);
  });
  socket.on('more people', drawplayer);
  socket.on('subinit', function(data) {
    console.log(data);
    $('#players').html('');
    for (i = 0; i < data.length; i++) {
      drawplayer(data[i]);
    }
  });

  function drawplayer(data) {
    $('#players').append('<tr><td class=subname>' + data.name + '</td><td class="color' + data.color + '"></td></tr>');
  }
}