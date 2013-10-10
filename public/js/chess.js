//-2 > No tile drawn // -1 > No figure on tile
var EMPTY = -2;
var TILE_SIZE = 50;

var Color = {
    WHITE: 100,
    BLACK: 200,
    RED: 300,
    GREEN: 400
}

function setPosition(pos, figureID){
    var oldPos = {"x":figureList[figureID].figure.x, "y":figureList[figureID].figure.y}
    var newPos = {"x": pos.x/TILE_SIZE, "y":pos.y / TILE_SIZE};

    figureList[figureID].setPosition(pos.x, pos.y);
    myBoard.moveFigureTo(oldPos.x, oldPos.y,newPos.x,newPos.y);
    figureList[figureID].figure = myBoard.board[newPos.y][newPos.x];

    //look if enPassant was used
    for(var i = 0; i < figureList.length; i++){
        var figure = figureList[i].figure;
        if(figure.enPassant){
            var behind = {"x": figure.x + figure.behind().x, "y": figure.y + figure.behind().y};
            if(myBoard.isEnemy(behind.x, behind.y)){
                socket.emit('sendRemoveFigure', i);
            }
        }
    }

    moveLayer.removeChildren();
    stage.draw();
}

function removeFigure(index){
    console.log("removed");
    var x = figureList[index].figure.x;
    var y = figureList[index].figure.y;
    myBoard.board[y][x] = -1;
    figureList[index].remove();
    stage.draw();
}

$(document).ready(function () {
    socket = io.connect();
    socket.on('message', function(msg){
        $clientCounter.html(msg.clients);
    });
    socket.on('setPosition',setPosition);
    socket.on('removeFigure',removeFigure);

    $clientCounter = $('#client_count');
         
    myBoard = new Board();

    pieces = new Image();
    pieces.onload = function () {
        drawBoard();
    }
    pieces.src = 'img/figures.png';
 });


//draw Board on load
function drawBoard() {
    stage = new Kinetic.Stage({container: 'canvas',width: 700,height: 700});
    stage.on('mousedown', function(e) {
        boardClicked(e);
    });

    figureList = [];
    //board tiles
    boardLayer = new Kinetic.Layer(); //background layer for the chessboard
    moveLayer = new Kinetic.Layer(); //where the figures can go to
    moveLayer.setOpacity(0.5);
    figureLayer = new Kinetic.Layer(); //layer for figures
    for(var y = 0 ; y < 14 ; y++){
        for(var x = 0 ; x < 14 ; x++){
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
                    strokeWidth: 1,
                });
                boardLayer.add(rect);
                if(myBoard.board[y][x] != -1){
                    //set figure coordinate property
                    myBoard.board[y][x].x = x;
                    myBoard.board[y][x].y = y;
                    drawFigure(x,y);
                }
            }
        }       
    }
    stage.add(boardLayer);
    stage.add(moveLayer);
    stage.add(figureLayer);
}

//draw single figure with canvas
function drawFigure(x,y) {
    var figurePos = getFigureFromSpritesheet(myBoard.board[y][x]);
    var figureImage = new Kinetic.Image({
        x: x * TILE_SIZE,
        y: y * TILE_SIZE,
        image: pieces,
        width: TILE_SIZE,
        height: TILE_SIZE,
        draggable: true,
        crop: {x: figurePos.x,y: figurePos.y,width: TILE_SIZE,height: TILE_SIZE}
    });
    figureImage.figure = myBoard.board[y][x];
    figureLayer.add(figureImage);
    figureList.push(figureImage);

    figureImage.on("dragend", function() {
        var pos = figureImage.getPosition();
        var tilePos = getTileFromPosRound(pos.x,pos.y);
        var newPosX = tilePos.x * TILE_SIZE;
        var newPosY = tilePos.y * TILE_SIZE;
        var figureID = figureList.indexOf(figureImage);

        var oldPos = {"x":figureList[figureID].figure.x, "y":figureList[figureID].figure.y}
        

        if(isPossible(oldPos, tilePos)){
            for(var i = 0; i< figureList.length; i++){
                //look if another figure is on the dopped tile
                if(figureList[i].getPosition().x == newPosX && figureList[i].getPosition().y == newPosY){
                    //ignore dragged figure
                    if(figureList[i] != figureImage){
                       socket.emit('sendRemoveFigure',i);
                    } 
                }
            }
            socket.emit('sendPosition',{"x":newPosX,"y":newPosY},figureID);
        }
        else {
            setPosition({"x": oldPos.x * TILE_SIZE, "y": oldPos.y * TILE_SIZE}, figureID);
        }
        stage.draw();
    });
}

function isPossible(oldPos,newPos){
    var possibleMoves = myBoard.getFigureAtPos(oldPos.x, oldPos.y).possibleMoves(myBoard);
    for(var i = 0; i < possibleMoves.length; i++){
        if(possibleMoves[i].x == newPos.x && possibleMoves[i].y == newPos.y){
            return true;
        }
    }
    return false;
}

//canvas mousedown event
function boardClicked(e) {
    tilePos = getTileFromPosFloor(e.offsetX, e.offsetY);
    if(myBoard.clickIsLegal(tilePos.x, tilePos.y)){
        console.log("FigureX: "+myBoard.board[tilePos.y][tilePos.x].x+ " y: "+myBoard.board[tilePos.y][tilePos.x].y );
        var possibleMoves = myBoard.board[tilePos.y][tilePos.x].possibleMoves(myBoard);
        moveLayer.removeChildren();         
        for(var i = 0; i< possibleMoves.length; i++){

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
    else if(figure.color == Color.BLACK)
        y = 1;
    else if(figure.color == Color.RED)
        y = 2;
    else if(figure.color == Color.GREEN)
        y = 3;

    var position = {
        'x': x * 50,
        'y': y * 50
    };
    return position;
}

function getBoardColor(x, y) {
    return (x + y) % 2 === 0 ? '#fee472': '#00B392';
}
