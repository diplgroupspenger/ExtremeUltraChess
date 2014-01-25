var TILE_SIZE = 50;

function startgame(socket, color){
    socket.on('setPosition',setPosition);
       
    socket.on('sendStatus', function(serverBoard, serverTurn){
        myBoard = new Board(serverBoard);
        turn = new Turn();
        turn.player = serverTurn.player;
        turn.curPlayer = serverTurn.curPlayer;
        tryDrawBoard();
    });
    socket.emit('getGame');
    socket.emit('getBoard');

    pieces = new Image();
    pieces.onload = tryDrawBoard;
    pieces.src = 'img/figures.png';

    player = color;
    turn = new Turn();
    $('#curPlayer').text('White');

    var onceCb = false;

    function tryDrawBoard () {
        if(!onceCb) {
            onceCb = true;
            return;
        }

        drawBoard(TILE_SIZE);
    }
}

function setPosition(newPos, figureID, moved){
    var oldPos = {"x":figureList[figureID].figure.x, "y":figureList[figureID].figure.y};

    //remove figure if captured
    if(myBoard.isFigure(newPos.x, newPos.y)){
        if(oldPos.x !== newPos.x || oldPos.y !== newPos.y)  {
            //check if a king was taken and remove player from turn system
            if(myBoard.board[newPos.y][newPos.x].type == FigureType.KING) {
                var figureColor = myBoard.board[newPos.y][newPos.x].color;
                turn.remove(figureColor);
            }
            removeFigure(newPos);
        }
    }

    //figureList[figureID].setPosition(newPos.x * TILE_SIZE , newPos.y * TILE_SIZE);
    figureList[figureID].setX(newPos.x * TILE_SIZE);
    figureList[figureID].setY(newPos.y * TILE_SIZE);
    if(oldPos.x !== newPos.x || oldPos.y !== newPos.y)
    myBoard.moveFigureTo(oldPos.x, oldPos.y,newPos.x,newPos.y);

    figureList[figureID].figure = myBoard.board[newPos.y][newPos.x];

    if(myBoard.isEnPassant()){
        removeFigure(oldPos);
    }

    if(moved) {
       turn.nextTurn();
       $('#curPlayer').text(colorToString(turn.player));
    }

    moveLayer.removeChildren();
    stage.draw();
}

function removeFigure(pos){
    myBoard.board[pos.y][pos.x] = -1;
    for(var i = 0; i < figureList.length; i++){
        if(figureList[i].figure.x == pos.x && figureList[i].figure.y == pos.y){
            figureList[i].remove();
            figureList[i].taken = true;
            stage.draw();
        }
    }
    //check if only 1 king is left
    checkForGameEnd();
}

function checkForGameEnd() {
    var countKings = 0;
    for(var i = 0; i < figureList.length; i++) {
        if(figureList[i].figure.type == FigureType.KING &&
            figureList[i].taken === undefined) {
            countKings++;
        }

        if(countKings === 4)
            break;
    }

    if(countKings === 1)
        console.log("game over");
}

//draw Board on load
function drawBoard(TILE_SIZE) {
    stage = new Kinetic.Stage({container: 'canvas',width: 700,height: 700});
    stage.on('mousedown', function(e) {
        boardClicked(e);
    });

    figureList = [];
    
    //board tiles
    boardLayer = new Kinetic.Layer(); //background layer for the chessboard
    moveLayer = new Kinetic.Layer(); //where the figures can go to
    figureLayer = new Kinetic.Layer(); //layer for figures

    for(var y = 0 ; y < myBoard.board.length; y++){
        for(var x = 0 ; x < myBoard.board[0].length; x++){
            var tilex = x * TILE_SIZE;
            var tiley = y * TILE_SIZE;
            if(myBoard.board[y][x] != -2) {
                var rect = new Kinetic.Rect({
                    x: tilex,
                    y: tiley,
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                    fill: getBoardColor(x,y),
                    stroke: 'black',
                    strokeWidth: 1
                });
                boardLayer.add(rect);
                if(myBoard.board[y][x] !== -1){
                    //set figure coordinate property

                    var playerColor = (myBoard.board[y][x].color === player);

                    drawFigure(x,y, TILE_SIZE, playerColor);
                }
            }
        }
    }
    
    rotateBoard();
   
    stage.add(boardLayer);
    stage.add(moveLayer);
    stage.add(figureLayer);
}

//draw single figure with canvas
function drawFigure(x,y, TILE_SIZE, playerColor) {
    var figurePos = getFigureFromSpritesheet(myBoard.board[y][x]);
    var figureImage = new Kinetic.Image({
        x: x * TILE_SIZE,
        y: y * TILE_SIZE,
        image: pieces,
        width: TILE_SIZE,
        height: TILE_SIZE,
        draggable: playerColor,
        crop: {x: figurePos.x,y: figurePos.y,width: TILE_SIZE,height: TILE_SIZE}
    });
    figureImage.figure = myBoard.board[y][x];
    figureLayer.add(figureImage);
    figureList.push(figureImage);

    figureImage.on("dragstart", function dragstart(){
        figureImage.moveToTop();
    });

    figureImage.on("dragend", function dragend(){
        var pos = figureImage.getPosition();
        var tilePos = getTileFromPosRound(pos.x,pos.y);
        var figureID = figureList.indexOf(figureImage);
        var oldPos = {"x":figureList[figureID].figure.x, "y":figureList[figureID].figure.y};
        var figureColor = myBoard.board[oldPos.y][oldPos.x].color;

        if(player == turn.player && figureColor == player &&
            myBoard.isPossibleToMove(oldPos, tilePos)){
            socket.emit('sendPosition',{"x":oldPos.x,"y":oldPos.y},{"x":tilePos.x,"y":tilePos.y},figureID,player);
        }
        else {
            //place figure back to old tile
            setPosition({"x": oldPos.x, "y": oldPos.y}, figureID, false);
        }
        stage.draw();
    });
}

function rotateBoard(){
    //if color == white -> do nothing
    if(player === Color.BLACK){
        stage.rotateDeg(180);
        stage.setOffset(stage.getHeight(), stage.getWidth());
        //rotate figures back
        for(var i = 0; i < figureList.length; i++){
            image = figureList[i];
            image.rotateDeg(180);
            image.setOffset(image.getHeight(), image.getWidth());
        }
    } else if(player === Color.RED){
        stage.rotateDeg(-90);
        stage.setOffset(stage.getHeight(), 0);
        //rotate figures back
        for(var i = 0; i < figureList.length; i++){
            image = figureList[i];
            image.rotateDeg(90);
            image.setOffset(0, image.getWidth());
        }
    } else if(player === Color.GREEN){
        stage.rotateDeg(90);
        stage.setOffset(0, stage.getWidth());
        //rotate figures back
        for(var i = 0; i < figureList.length; i++){
            image = figureList[i];
            image.rotateDeg(-90);
            image.setOffset(image.getHeight(), 0);
        }
    }
}

//canvas mousedown event
function boardClicked(e) {
    var nodePos = e.targetNode.getPosition();
    var tilePos = getTileFromPosRound(nodePos.x, nodePos.y);

    var moveLayerChildren = moveLayer.getChildren();
    var i = 0;
    for(i = 0; i < moveLayerChildren.length; i++) {
        //click on tile, which is possible to move to
        if(moveLayerChildren[i].getPosition().x == nodePos.x && moveLayerChildren[i].getPosition().y == nodePos.y) {
            var clickedFigure = moveLayer.currentFigure;
            var figureID = figureList.indexOf(clickedFigure);
            var oldPos = {'x':clickedFigure.getPosition().x / TILE_SIZE, 'y':clickedFigure.getPosition().y / TILE_SIZE};
            socket.emit('sendPosition',{"x":oldPos.x,"y":oldPos.y},{"x":tilePos.x,"y":tilePos.y},figureID);
            return;
        }
    }

    if(myBoard.isFigure(tilePos.x, tilePos.y)){
        if(myBoard.board[tilePos.y][tilePos.x].color == player && turn.player == player) {
            var possibleMoves = myBoard.board[tilePos.y][tilePos.x].possibleMoves(myBoard);
            moveLayer.removeChildren();
            moveLayer.currentFigure = e.targetNode;
            for(i = 0; i< possibleMoves.length; i++){
                var rect = new Kinetic.Rect({
                    x: possibleMoves[i].x * TILE_SIZE,
                    y: possibleMoves[i].y * TILE_SIZE,
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                    fill: 'red'
                });

                moveLayer.add(rect);
            }
        }
    }
       
    moveLayer.draw();
}

//get tile coordinates from total coordinates
function getTileFromPosRound(x, y) {
    var position = {
        'x': Math.round(x / TILE_SIZE),
        'y': Math.round(y / TILE_SIZE)
    };
    return position;
}

function getTileFromPosFloor(x, y) {
    var position = {
        'x': Math.floor(x / TILE_SIZE),
        'y': Math.floor(y / TILE_SIZE)
    };
    return position;
}

//get spritesheet coordinates
function getFigureFromSpritesheet(figure) {
    var x = figure.type.id;
    var y;

    if(figure.color == Color.WHITE)
        y = 0;
    else if(figure.color == Color.GREEN)
        y = 1;
    else if(figure.color == Color.RED)
        y = 2;
    else if(figure.color == Color.BLACK)
        y = 3;

    var position = {
        'x': x * 50,
        'y': y * 50
    };
    return position;
}

function colorToString(color) {
    if(color == Color.WHITE) {
        return 'White';
    }
    else if(color == Color.RED) {
        return 'Red';
    }
    else if(color == Color.BLACK) {
        return 'Black';
    }
    else if(color == Color.GREEN) {
        return 'Green';
    }
}

function getBoardColor(x, y) {
    return (x + y) % 2 === 0 ? '#FF6600': '#336699';
}