TILE_SIZE = 50;
TOTAL_HEIGHT = 0;
TOTAL_WIDTH = 0;

//lockFigures while waiting to convertPawn
var lockFigures = false;
var curPossibleMoves = [];
var curForbiddenMoves = [];
//DEBUG
var turnOn = true;
var ignPossible = false;

function startgame(socket, color, time) {
  //DEBUG
  $('#cmdField').on("keypress", function(e) {
    if (e.keyCode == 13) {
      var text = $('#cmdField').val();
      checkCmd(text);
    }
  });
  $("#leave")
    .button()
    .click(function() {
      terminateGame();
    });

  socket.on('setPosition', setPosition);
  socket.on('sendStatus', setStatus);
  socket.on('updateCheckedTiles', updateCheckedTiles);
  socket.emit('getGame');
  socket.emit('getBoard');

  pieces = new Image();
  pieces.onload = tryDrawBoard;
  pieces.src = 'img/figures.png';

  player = color;
  onceCb = false;

  var lazyLayout = _.debounce(resizeCanvas, 300);
  $(window).resize(lazyLayout);
}

function updateCheckedTiles(checkedTiles){
  myBoard.checkedTiles = checkedTiles;
  drawCheckedTiles();
}

function setPosition(newPos, figureID, moved) {
  var oldPos = {
    "x": figureList[figureID].figure.x,
    "y": figureList[figureID].figure.y
  };

  //remove figure if captured
  if (myBoard.isFigure(newPos.x, newPos.y)) {
    if (oldPos.x !== newPos.x || oldPos.y !== newPos.y) {
      //check if a king was taken and remove player from turn system
      if (myBoard.board[newPos.y][newPos.x].type === FigureType.KING) {
        var figureColor = myBoard.board[newPos.y][newPos.x].color;
        turn.remove(figureColor);
      }
      removeFigure(newPos);
    }
  }

  //figureList[figureID].setPosition(newPos.x * TILE_SIZE , newPos.y * TILE_SIZE);
  figureList[figureID].setX(newPos.x * TILE_SIZE);
  figureList[figureID].setY(newPos.y * TILE_SIZE);

  if (oldPos.x !== newPos.x || oldPos.y !== newPos.y)
    myBoard.moveFigureTo(oldPos.x, oldPos.y, newPos.x, newPos.y);

    figureList[figureID].figure = myBoard.board[newPos.y][newPos.x];

  if (moved) {

    if (myBoard.isEnPassant()) {
      removeFigure(oldPos);
    }
    if (!pawnConvertion(figureID, newPos)) {
      setNextTurn();
    }
  }

  moveLayer.removeChildren();
  curPossibleMoves = [];
  stage.draw();
}

function setStatus(serverBoard, exportedTurn) {
  myBoard = new Board(serverBoard);
  turn = new Turn(null, cdCallback, turnCallback, exportedTurn);
  $('#curPlayer').text(colorToString(turn.curPlayer.color));
  tryDrawBoard();
}

//countdown callback from turn.js
function cdCallback() {
  checkForGameEnd();
  $('#timeCounter').text(turn.curSeconds + '');
  if(turn.extraSeconds) {
    $('#timeCounter').addClass('blink');
    if(player == turn.curPlayer.color)
      $('#timeOutMessage').show();
  }
  else {
    $('#timeCounter').removeClass('blink');
    $('#timeOutMessage').hide();
  }
}

function turnCallback() {
  $('#curPlayer').text(colorToString(turn.curPlayer.color));
  $('#timeCounter').text(turn.curSeconds + '');
}

function tryDrawBoard() {
  if (!onceCb) {
    onceCb = true;
    return;
  }
  initCanvas();
}

function setNextTurn() {
  turn.nextTurn();
  $('#curPlayer').text(colorToString(turn.curPlayer.color));
  drawCheckedTiles();
}

function removeFigure(pos) {
  myBoard.board[pos.y][pos.x] = -1;
  for (var i = 0; i < figureList.length; i++) {
    if (figureList[i].figure.x === pos.x && figureList[i].figure.y === pos.y) {
      figureList[i].remove();
      figureList[i].taken = true;
      stage.draw();
    }
  }
}

function checkForGameEnd() {
  if(turn.getDeadPlayer() >= 3)
    showEndDialog(turn.getWinner());
}

function pawnConvertion(id, pos) {
  if (figureList[id].figure.type === FigureType.PAWN) {
    if (player === turn.curPlayer.color && figureList[id].figure.color === player) {
      if ((player == Color.WHITE && pos.y === 0) ||
        (player == Color.BLACK && pos.y == myBoard.board.length) ||
        (player == Color.RED && pos.x == myBoard.board[0].length) ||
        (player == Color.GREEN && pos.x === 0)) {
        convertPawn(id, pos); //convertPawn.js
        return true;
      }
    }
  }
  return false;
}

function resizeCanvas() {
  oldHeight = stage.getHeight();
  oldWidth = stage.getWidth();
  newWidth = window.innerWidth - 250; //250px sidebar
  newHeight = window.innerHeight;

  if (newHeight < newWidth) {
    TILE_SIZE = newHeight / myBoard.board.length;
    width = TILE_SIZE * myBoard.board[0].length;
    stage.setHeight(newHeight);
    stage.setWidth(width);
    $('#canvas').height(newHeight).width(width);
  } else {
    TILE_SIZE = newWidth / myBoard.board[0].length;
    height = TILE_SIZE * myBoard.board.length;
    stage.setWidth(newWidth);
    stage.setHeight(height);
    $('#canvas').height(height).width(newWidth);
  }

  minX = stage.getX();
  maxX = stage.getX() + stage.getWidth();
  minY = stage.getY();
  maxY = stage.getY() + stage.getHeight();

  boardLayer.removeChildren();
  figureLayer.removeChildren();
  moveLayer.removeChildren();
  curPossibleMoves = [];
  curForbiddenMoves = [];
  drawBoard();
  rotateBoardOffset();
  drawPossibleMoves();
  drawCheckedTiles();
  redrawConvertion();
}

function initCanvas() {
  newWidth = window.innerWidth - 250; //250px sidebar
  newHeight = window.innerHeight;

  canvasHeight = 0;
  canvasWidth = 0;
  if (newHeight < newWidth) {
    TILE_SIZE = newHeight / myBoard.board.length;
    width = canvasWidth = TILE_SIZE * myBoard.board[0].length;
    canvasHeight = newHeight;
    canvasWidth = width;
    $('#canvas').height(newHeight).width(width);
  } else {
    TILE_SIZE = newWidth / myBoard.board[0].length;
    height = TILE_SIZE * myBoard.board.length;
    canvasWidth = newWidth;
    canvasHeight = height;
    $('#canvas').height(height).width(newWidth);
  }
  stage = new Kinetic.Stage({
    container: 'canvas',
    height: canvasHeight,
    width: canvasWidth
  });

  TOTAL_HEIGHT = canvasHeight;
  TOTAL_WIDTH = canvasWidth;

  stage.on('mousedown', function(e) {
    boardClicked(e);
  });

  //canvas boundaries
  minX = stage.getX();
  maxX = stage.getX() + stage.getWidth();
  minY = stage.getY();
  maxY = stage.getY() + stage.getHeight();

  figureList = [];

  //board tiles
  boardLayer = new Kinetic.Layer(); //background layer for the chessboard
  moveLayer = new Kinetic.Layer(); //where the figures can go to
  figureLayer = new Kinetic.Layer(); //layer for figures
  //debugging layer
  checkedTilesLayer = new Kinetic.Layer();
  foreGroundLayer = new Kinetic.Layer(); //layer on the top, pawn convertion and ui

  stage.add(boardLayer);
  stage.add(moveLayer);
  stage.add(figureLayer);
  //debugging layer
  stage.add(checkedTilesLayer);
  stage.add(foreGroundLayer);

  drawBoard();
  rotateBoard();

}

//draw Board on load
function drawBoard() {
  for (var y = 0; y < myBoard.board.length; y++) {
    for (var x = 0; x < myBoard.board[0].length; x++) {
      var tilex = x * TILE_SIZE;
      var tiley = y * TILE_SIZE;
      if (myBoard.board[y][x] !== -2) {
        var rect = new Kinetic.Rect({
          x: tilex,
          y: tiley,
          width: TILE_SIZE,
          height: TILE_SIZE,
          fill: getBoardColor(x, y),
          stroke: 'black',
          strokeWidth: 1
        });
        boardLayer.add(rect);
        if (myBoard.board[y][x] !== -1) {
          //set figure coordinate property
          var playerColor = (myBoard.board[y][x].color === player);
          drawFigure(x, y, playerColor);
        }
      }
    }
  }
}

//draw single figure with canvas
function drawFigure(x, y, playerColor) {
  var figurePos = getFigureFromSpritesheet(myBoard.board[y][x]);
  var figureImage = new Kinetic.Image({
    x: x * TILE_SIZE,
    y: y * TILE_SIZE,
    image: pieces,
    width: TILE_SIZE,
    height: TILE_SIZE,
    draggable: playerColor,
    dragBoundFunc: function(pos) {
      var X = pos.x;
      var Y = pos.y;
      var offset = this.getOffset();
      if (X < minX + offset.x) {
        X = 0 + offset.x;
      }
      if (X > maxX - this.getWidth() + offset.x) {
        X = maxX - this.getWidth() + offset.x;
      }
      if (Y < 0 + offset.y) {
        Y = 0 + offset.y;
      }
      if (Y > maxY - this.getHeight() + offset.y) {
        Y = maxX - this.getHeight() + offset.y;
      }
      return ({
        x: X,
        y: Y
      });
    },
    crop: {
      x: figurePos.x,
      y: figurePos.y,
      width: 50,
      height: 50
    }
  });
  figureImage.figure = myBoard.board[y][x];
  figureLayer.add(figureImage);
  figureList.push(figureImage);

  figureImage.on("dragstart", function dragstart() {
    figureImage.moveToTop();
  });

  figureImage.on("dragend", function dragend() {
    var pos = figureImage.getPosition();
    var newPos = getTileFromPosRound(pos.x, pos.y);
    var figureID = figureList.indexOf(figureImage);
    var oldPos = {
      "x": figureList[figureID].figure.x,
      "y": figureList[figureID].figure.y
    };
    var figureColor = myBoard.board[oldPos.y][oldPos.x].color;

    //if (((player === turn.curPlayer.color && figureColor === player) && !lockFigures) || !turnOn && (myBoard.isPossibleToMove(oldPos, newPos) || ignPossible)) {
    if((player === turn.curPlayer.color && figureColor === player || !turnOn) &&
      myBoard.isPossibleToMove(oldPos, newPos) && !lockFigures){
      setPosition(newPos, figureID, false);
      socket.emit('sendPosition', oldPos, newPos, figureID, player);
    } else {
      //place figure back to old tile
      setPosition(oldPos, figureID, false);
    }

    stage.draw();
  });
}

function drawPossibleMoves(isKing) {
  moveLayer.removeChildren();
  var x, y;

  for (var i = 0; i < curPossibleMoves.length; i++) {
    x = curPossibleMoves[i].x;
    y = curPossibleMoves[i].y;

    var rect = new Kinetic.Rect({
      x: x * TILE_SIZE,
      y: y * TILE_SIZE,
      width: TILE_SIZE,
      height: TILE_SIZE,
      fill: getBoardColor(x, y),
      stroke: colorToString(player),
      strokeWidth: 3,
      shadowColor: colorToString(player),
      shadowBlur: 20
    });

    moveLayer.add(rect);

  }

  if(isKing){
    console.log("forbiddenLENGTH: " + curForbiddenMoves.length);
    for(i = 0; i < curForbiddenMoves.length; i++){
      x = curForbiddenMoves[i].x;
      y = curForbiddenMoves[i].y;

      var topLeftX = x * TILE_SIZE + TILE_SIZE * 0.2;
      var topLeftY = y * TILE_SIZE + TILE_SIZE * 0.2;

      var topRightX = x * TILE_SIZE + TILE_SIZE * 0.8;
      var topRightY = y * TILE_SIZE + TILE_SIZE * 0.2;

      var bottomLeftX = x * TILE_SIZE + TILE_SIZE * 0.2;
      var bottomLeftY = y * TILE_SIZE + TILE_SIZE * 0.8;

      var bottomRightX = x * TILE_SIZE + TILE_SIZE * 0.8;
      var bottomRightY = y * TILE_SIZE + TILE_SIZE * 0.8;

      var crossLine1 = new Kinetic.Line({
        points: [topLeftX, topLeftY, bottomRightX, bottomRightY],
        stroke: 'red',
        strokeWidth: TILE_SIZE * 0.1,
        lineCap: 'round',
        lineJoin: 'round',
        shadowColor: 'red',
        shadowBlur: 10
      });

      var crossLine2 = new Kinetic.Line({
        points: [bottomLeftX, bottomLeftY, topRightX, topRightY],
        stroke: 'red',
        strokeWidth: TILE_SIZE * 0.1,
        lineCap: 'round',
        lineJoin: 'round',
        shadowColor: 'red',
        shadowBlur: 10
      });

      moveLayer.add(crossLine1);
      moveLayer.add(crossLine2);
    }
  }



  moveLayer.draw();
}


//debugging function
function drawCheckedTiles(){
  checkedTilesLayer.removeChildren();
  for(var i = 0; i < myBoard.checkedTiles.length; i++){
    var posX = myBoard.checkedTiles[i].x;
    var posY = myBoard.checkedTiles[i].y;
    var color = myBoard.checkedTiles[i].figure.color;

    var dot = new Kinetic.Circle({
      x: posX * TILE_SIZE + TILE_SIZE / 2,
      y: posY * TILE_SIZE + TILE_SIZE / 2,
      radius: 10,
      fill: colorToString(color)
    });
    checkedTilesLayer.add(dot);
  }
  checkedTilesLayer.draw();
}

//Initial Rotation
function rotateBoard() {
  var i = 0;
  //if color == white -> do nothing
  if (player === Color.BLACK) {
    stage.rotateDeg(180);
    stage.setOffset(stage.getHeight(), stage.getWidth());
  } else if (player === Color.RED) {
    stage.rotateDeg(-90);
    stage.setOffset(stage.getHeight(), 0);
  } else if (player === Color.GREEN) {
    stage.rotateDeg(90);
    stage.setOffset(0, stage.getWidth());
  }
  rotateFigures();
  stage.draw();
}

//Called after initial Rotation
function rotateBoardOffset() {
  //if color == white -> do nothing
  if (player === Color.BLACK) {
    stage.setOffset(stage.getHeight(), stage.getWidth());
  } else if (player === Color.RED) {
    stage.setOffset(stage.getHeight(), 0);
  } else if (player === Color.GREEN) {
    stage.setOffset(0, stage.getWidth());
  }
  rotateFigures();
  stage.draw();
}

//rotate figures back, after rotating stage
function rotateFigures() {
  //white doesn't need to be rotated
  if (player !== Color.WHITE) {
    for (var i = 0; i < figureList.length; i++) {
      if (player === Color.BLACK) {
        image = figureList[i];
        image.rotateDeg(180);
        image.setOffset(image.getHeight(), image.getWidth());
      } else if (player === Color.RED) {
        image = figureList[i];
        image.rotateDeg(90);
        image.setOffset(0, image.getWidth());
      } else if (player === Color.GREEN) {
        image = figureList[i];
        image.rotateDeg(-90);
        image.setOffset(image.getHeight(), 0);
      }
    }
  }
}

//canvas mousedown event
function boardClicked(e) {
  var nodePos = e.targetNode.getPosition();
  var tilePos = getTileFromPosRound(nodePos.x, nodePos.y);

/*
  var moveLayerChildren = moveLayer.getChildren();
  var i = 0;
  for (i = 0; i < moveLayerChildren.length; i++) {
    //click on tile, which is possible to move to
    if ((moveLayerChildren[i].getPosition().x === nodePos.x && moveLayerChildren[i].getPosition().y === nodePos.y && lockFigures === false) || ignPossible) {
      var clickedFigure = moveLayer.currentFigure;
      var figureID = figureList.indexOf(clickedFigure);
      var oldPos = {
        'x': clickedFigure.figure.x,
        'y': clickedFigure.figure.y
      };
      console.log("oldPos: " + oldPos.x + " oldPosy: " + oldPos.y + " newX: " + tilePos.x + " newY:" + tilePos.y);
      socket.emit('sendPosition', {
        "x": oldPos.x,
        "y": oldPos.y
      }, {
        "x": tilePos.x,
        "y": tilePos.y
      }, figureID, player);
      moveLayer.draw();
      return;
    }
  }
  */


  if (myBoard.isFigure(tilePos.x, tilePos.y)) {
    if ((myBoard.board[tilePos.y][tilePos.x].color === player && turn.curPlayer.color === player && lockFigures === false) || !turnOn) {
      var figure = myBoard.get(tilePos.x, tilePos.y);
      curPossibleMoves = figure.possibleMoves(myBoard);
      if(figure.type === FigureType.KING){
        curForbiddenMoves = figure.forbiddenMoves(myBoard);
        drawPossibleMoves(true);
      }
      else{
        drawPossibleMoves();
      }
      moveLayer.currentFigure = e.targetNode;
    }
  }
}

//get tile coordinates from total coordinates
function getTileFromPosRound(x, y) {
  var position = {
    'x': Math.round(x / TILE_SIZE),
    'y': Math.round(y / TILE_SIZE)
  };
  return position;
}

//get spritesheet coordinates
function getFigureFromSpritesheet(figure) {
  var x = figure.type.id;
  var y;

  if (figure.color === Color.WHITE)
    y = 0;
  else if (figure.color === Color.GREEN)
    y = 1;
  else if (figure.color === Color.RED)
    y = 2;
  else if (figure.color === Color.BLACK)
    y = 3;

  var position = {
    'x': x * 50,
    'y': y * 50
  };
  return position;
}

function colorToString(color) {
  if (color === Color.WHITE) {
    return 'White';
  } else if (color === Color.RED) {
    return 'Red';
  } else if (color === Color.BLACK) {
    return 'Black';
  } else if (color === Color.GREEN) {
    return 'Green';
  }
}

function getBoardColor(x, y) {
  return (x + y) % 2 === 0 ? '#FF6600' : '#336699';
}

function showEndDialog(winner) {
  console.log(winner);
  bootbox.alert("Winner: "+colorToString(winner), function() {
    terminateGame();
  });
}

function terminateGame() {
  console.log('terminate');
  $('#cmdField').off("keypress");
  $("#leave").off("click");
  socket.removeListener('setPosition', setPosition);
  socket.removeListener('sendStatus', setStatus);
  stage.removeChildren();
  stage.draw();
  stage = null;
  turn.terminate();
  $("#canvas").empty();
  toLobby();
  socket.emit('leave');
  socket.emit('getGame');
}
