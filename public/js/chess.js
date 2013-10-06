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
    figureList[figureID].setPosition(pos.x, pos.y);
    stage.draw();
}

function removeFigure(index){
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
    stage.on('click', function(e) {
        boardClicked(e);
    });

    figureList = new Array();
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
    var figurePos = getFigureFromSpritesheet(myBoard.board[x][y]);
    var figureImage = new Kinetic.Image({
        x: y * TILE_SIZE,
        y: x * TILE_SIZE,
        image: pieces,
        width: TILE_SIZE,
        height: TILE_SIZE,
        draggable: true,
        crop: {x: figurePos.x,y: figurePos.y,width: TILE_SIZE,height: TILE_SIZE}
    });
    figureLayer.add(figureImage);
    figureList.push(figureImage);

    figureImage.on("dragend", function() {
        var pos = figureImage.getPosition();
        var tilePos = getTileFromPosRound(pos.x,pos.y);
        var newPosX = tilePos.x * TILE_SIZE;
        var newPosY = tilePos.y * TILE_SIZE;
        
        
        for(var i = 0; i< figureList.length; i++){
            //look if antother figure is on the dopped tile
            if(figureList[i].getPosition().x == newPosX && figureList[i].getPosition().y == newPosY){
                //ignore dragged figure
                if(figureList[i] != figureImage){
                   socket.emit('sendRemoveFigure',i);
                } 
            }
        }
        var figureID = figureList.indexOf(figureImage);
        socket.emit('sendPosition',{x:newPosX,y:newPosY},figureID);
        stage.draw();
    });
}

//canvas mousedown event
function boardClicked(e) {
    tilePos = getTileFromPosFloor(e.offsetX, e.offsetY);
    if(myBoard.clickIsLegal(tilePos.x, tilePos.y)){
        var possibleMoves = myBoard.board[tilePos.y][tilePos.x].possibleMoves(myBoard.board);
        moveLayer.removeChildren();
        for(var i = 0; i< possibleMoves.lenght; i++){
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
    stage.draw();
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
        'y': y * 50,
        'x': x * 50
    };
    return position;
}

function getBoardColor(x, y) {
    return (x + y) % 2 === 0 ? '#fee472': '#00B392';
}
