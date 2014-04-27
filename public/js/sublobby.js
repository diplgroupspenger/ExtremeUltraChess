function sublobby(socket, color, host, time) {
  socket.removeAllListeners('startgame');
  socket.removeAllListeners('more people');
  socket.removeAllListeners('subinit');
  socket.on('sendTurnTime', syncTime);
  socket.on('startgame', game);
  socket.on('more people', drawplayer);
  socket.on('subinit', subInit);

  var timeSpinner = $("input[name='turnTimeSpinner']");
  var changeTime = _.debounce(onTimeChanged, 500);
  if(socket.username === host) {
    $(timeSpinner).attr('readonly', false);
    $(timeSpinner).TouchSpin({
          min: 10,
          max: 300,
          boostat: 5
    });
  }
  else {
    $(timeSpinner).TouchSpin({
          min: 10,
          max: 300,
          boostat: 5,
          buttonup_class: "hidden",
          buttondown_class: "hidden"
    });
  }
  $(timeSpinner).val(time);
  $("input[name='turnTimeSpinner']").on('change', changeTime);

  function onTimeChanged() {
    socket.emit('turnTimeChanged',$(timeSpinner).val());
  }

  function syncTime(time) {
    $(timeSpinner).val(time);
  }

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