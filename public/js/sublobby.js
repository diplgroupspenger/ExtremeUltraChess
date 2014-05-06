function sublobby(socket, color, host, time) {
  socket.removeAllListeners('startgame');
  socket.removeAllListeners('more people');
  socket.removeAllListeners('subinit');
  socket.removeAllListeners('own user');
  socket.removeAllListeners('readychange');
  socket.removeAllListeners('sendTurnTime');
  socket.on('sendTurnTime', syncTime);
  socket.on('startgame', game);
  socket.on('more people', drawplayer);
  socket.on('subinit', subInit);
  socket.on('own user', drawplayer);
  socket.on('readychange', readychange);
  if (host == $('#name').text()) {
    $('#debutton').show();
    $('#debutton').on('click', function() {
      socket.emit('turnTimeChanged', $("input[name='turnTimeSpinner']").val());
      socket.emit('startgame');
    });
  }

  var timeSpinner = $("input[name='turnTimeSpinner']");
  var changeTime = _.debounce(onTimeChanged, 500);
  if (socket.username === host) {
    $(timeSpinner).attr('readonly', false);
    $(timeSpinner).TouchSpin({
      min: 10,
      max: 300,
      boostat: 5
    });
  } else {
    $(timeSpinner).TouchSpin({
      buttonup_class: "hidden",
      buttondown_class: "hidden"
    });
  }
  $(timeSpinner).val(time);
  $("input[name='turnTimeSpinner']").on('change', changeTime);

  function onTimeChanged() {
    socket.emit('turnTimeChanged', $(timeSpinner).val());
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
    var player = '<tr><td class=subname id="' + data.color + '"></td><td><input id="' + data.color + 'ready" type="checkbox" ';
    //<td class="color' + data.color + '"></td>
    if (!(data.own)) {
      player = player + 'disabled="disabled"';
    }
    player = player + '></td></tr>';
    $('#players').append(player);
    if (data.own) {
      $('#' + data.color).addClass("own");
      $('#' + data.color + 'ready').change(function() {
        socket.emit('readychange', this.checked);
      });
    }
    $('#' + data.color).text(data.name);
    $('#' + data.color + 'ready').prop('checked', data.ready);
  }

  function readychange(data) {
    $('#' + data.playercolor + 'ready').prop('checked', data.checked);
  }
}