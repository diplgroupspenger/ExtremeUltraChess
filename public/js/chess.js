//-2 > No tile drawn // -1 > No figure on tile
var EMPTY = -2;
var TILE_SIZE = 50;

var Color = {
    WHITE: 100,
    BLACK: 200,
    RED: 300,
    GREEN: 400
}

//array of the chessboard
var board = [[-2,-2,-2,new Figure(FigureType.ROOK, Color.BLACK),new Figure(FigureType.KNIGHT, Color.BLACK),new Figure(FigureType.BISHOP,Color.BLACK),new Figure(FigureType.KING,Color.BLACK),new Figure(FigureType.QUEEN,Color.BLACK),new Figure(FigureType.BISHOP,Color.BLACK),new Figure(FigureType.KNIGHT,Color.BLACK),new Figure(FigureType.ROOK,Color.BLACK),-2,-2,-2],
             [-2,-2,-2,new Figure(FigureType.PAWN,Color.BLACK),new Figure(FigureType.PAWN,Color.BLACK),new Figure(FigureType.PAWN,Color.BLACK),new Figure(FigureType.PAWN,Color.BLACK),new Figure(FigureType.PAWN,Color.BLACK),new Figure(FigureType.PAWN,Color.BLACK),new Figure(FigureType.PAWN,Color.BLACK),new Figure(FigureType.PAWN,Color.BLACK),-2,-2,-2],
             [-2,-2,-2,-1,-1,-1,-1,-1,-1,-1,-1,-2,-2,-2],
             [new Figure(FigureType.ROOK,Color.RED),new Figure(FigureType.PAWN,Color.RED),-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,new Figure(FigureType.PAWN,Color.GREEN),new Figure(FigureType.ROOK,Color.GREEN)],
             [new Figure(FigureType.KNIGHT,Color.RED),new Figure(FigureType.PAWN,Color.RED),-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,new Figure(FigureType.PAWN,Color.GREEN),new Figure(FigureType.KNIGHT,Color.GREEN)],
             [new Figure(FigureType.BISHOP,Color.RED),new Figure(FigureType.PAWN,Color.RED),-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,new Figure(FigureType.PAWN,Color.GREEN),new Figure(FigureType.BISHOP,Color.GREEN)],
             [new Figure(FigureType.KING,Color.RED),new Figure(FigureType.PAWN,Color.RED),-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,new Figure(FigureType.PAWN,Color.GREEN),new Figure(FigureType.QUEEN,Color.GREEN)],
             [new Figure(FigureType.QUEEN,Color.RED),new Figure(FigureType.PAWN,Color.RED),-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,new Figure(FigureType.PAWN,Color.GREEN),new Figure(FigureType.KING,Color.GREEN)],
             [new Figure(FigureType.BISHOP,Color.RED),new Figure(FigureType.PAWN,Color.RED),-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,new Figure(FigureType.PAWN,Color.GREEN),new Figure(FigureType.BISHOP,Color.GREEN)],
             [new Figure(FigureType.KNIGHT,Color.RED),new Figure(FigureType.PAWN,Color.RED),-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,new Figure(FigureType.PAWN,Color.GREEN),new Figure(FigureType.KNIGHT,Color.GREEN)],
             [new Figure(FigureType.ROOK,Color.RED),new Figure(FigureType.PAWN,Color.RED),-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,new Figure(FigureType.PAWN,Color.GREEN),new Figure(FigureType.ROOK,Color.GREEN)],
             [-2,-2,-2,-1,-1,-1,-1,-1,-1,-1,-1,-2,-2,-2],
             [-2,-2,-2,new Figure(FigureType.PAWN,Color.WHITE),new Figure(FigureType.PAWN,Color.WHITE),new Figure(FigureType.PAWN,Color.WHITE),new Figure(FigureType.PAWN,Color.WHITE),new Figure(FigureType.PAWN,Color.WHITE),new Figure(FigureType.PAWN,Color.WHITE),new Figure(FigureType.PAWN,Color.WHITE),new Figure(FigureType.PAWN,Color.WHITE),-2,-2,-2],
             [-2,-2,-2,new Figure(FigureType.ROOK,Color.WHITE),new Figure(FigureType.KNIGHT,Color.WHITE),new Figure(FigureType.BISHOP,Color.WHITE),new Figure(FigureType.QUEEN,Color.WHITE),new Figure(FigureType.KING,Color.WHITE),new Figure(FigureType.BISHOP,Color.WHITE),new Figure(FigureType.KNIGHT,Color.WHITE),new Figure(FigureType.ROOK,Color.WHITE),-2,-2,-2]];

function setPosition(pos, figureID){
    figureList[figureID].setPosition(pos.x, pos.y);
    stage.draw();
}

function removeFigure(index){
    figureList[index].remove(); 
    stage.draw();
}

$(document).ready(function () {
    socket = io.connect('http://chess.flo-lan.com');
    socket.on('message', function(msg){
        $clientCounter.html(msg.clients);
    });
    socket.on('setPosition',setPosition);
    socket.on('removeFigure',removeFigure);

    $clientCounter = $('#client_count');
         
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
            if(board[y][x] != -2) {
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
                if(board[y][x] != -1){
                    //set figure coordinate property
                    board[y][x].x = x;
                    board[y][x].y = y;
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
    var figurePos = getFigureFromSpritesheet(board[x][y]);
    var figure = new Kinetic.Image({
        x: y * TILE_SIZE,
        y: x * TILE_SIZE,
        image: pieces,
        width: TILE_SIZE,
        height: TILE_SIZE,
        draggable: true,
        crop: {x: figurePos.x,y: figurePos.y,width: TILE_SIZE,height: TILE_SIZE}
    });
    figureLayer.add(figure);
    figureList.push(figure);

    figure.on("dragend", function() {
        var pos = figure.getPosition();
        var tilePos = getTileFromPos(pos.x,pos.y);
        var newPosX = tilePos.x * TILE_SIZE;
        var newPosY = tilePos.y * TILE_SIZE;
        
        
        for(var i = 0; i< figureList.length; i++){
            //look if antother figure is on the dopped tile
            if(figureList[i].getPosition().x == newPosX && figureList[i].getPosition().y == newPosY){
                //ignore dragged figure
                if(figureList[i] != figure){
                   socket.emit('sendRemoveFigure',i);
                } 
            }
        }
        var figureID = figureList.indexOf(figure);
        socket.emit('sendPosition',{x:newPosX,y:newPosY},figureID);
        stage.draw();
    });
}

//canvas mousedown event
function boardClicked(e) {
    tilePos = getTileFromPos(e.offsetX, e.offsetY);
    if(clickIsLegal(tilePos.x, tilePos.y)){
        var possibleMoves = board[tilePos.y][tilePos.x].possibleMoves();
        var rect = new Kinetic.Rect({
            x: possibleMoves.x * TILE_SIZE,
            y: possibleMoves.y * TILE_SIZE,
            width: TILE_SIZE,
            height: TILE_SIZE,
            fill: 'red'
        });
        moveLayer.removeChildren();
        moveLayer.add(rect);
        stage.draw();
    }
}

//get tile coordinates from total coordinates
function getTileFromPos(x, y) {
    var position = {
        'x': Math.round(x / TILE_SIZE),
        'y': Math.round(y / TILE_SIZE)
    };
    return position;
}

//only figures are legal
function clickIsLegal(tileX, tileY) {
    if(board[tileY][tileX]!= -1 && board[tileY][tileX]!= -2)
        return true;
    else
        return false;
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
