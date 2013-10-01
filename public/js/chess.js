var WHITE_KING = 4;
var WHITE_QUEEN = 3;
var WHITE_ROOK = 5;
var WHITE_BISHOP = 2;
var WHITE_KNIGHT = 1;
var WHITE_PAWN = 0;
 
var BLACK_KING = 10;
var BLACK_QUEEN = 9;
var BLACK_ROOK = 11;
var BLACK_BISHOP = 8;
var BLACK_KNIGHT = 7;
var BLACK_PAWN = 6;

var RED_KING = 16;
var RED_QUEEN = 15;
var RED_ROOK = 17;
var RED_BISHOP = 14;
var RED_KNIGHT = 13;
var RED_PAWN = 12;

var GREEN_KING = 22;
var GREEN_QUEEN = 21;
var GREEN_ROOK = 23;
var GREEN_BISHOP = 20;
var GREEN_KNIGHT = 19;
var GREEN_PAWN = 18;

var EMPTY = -2;


var board = [[-2,-2,-2,WHITE_ROOK,WHITE_BISHOP,WHITE_KNIGHT,WHITE_QUEEN,WHITE_KING,WHITE_KNIGHT,WHITE_BISHOP,WHITE_ROOK,-2,-2,-2],
             [-2,-2,-2,WHITE_PAWN,WHITE_PAWN,WHITE_PAWN,WHITE_PAWN,WHITE_PAWN,WHITE_PAWN,WHITE_PAWN,WHITE_PAWN,-2,-2,-2],
             [-2,-2,-2,-1,-1,-1,-1,-1,-1,-1,-1,-2,-2,-2],
             [RED_ROOK,RED_PAWN,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,GREEN_PAWN,GREEN_ROOK],
             [RED_BISHOP,RED_PAWN,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,GREEN_PAWN,GREEN_BISHOP],
             [RED_KNIGHT,RED_PAWN,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,GREEN_PAWN,GREEN_KNIGHT],
             [RED_QUEEN,RED_PAWN,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,GREEN_PAWN,GREEN_QUEEN],
             [RED_KING,RED_PAWN,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,GREEN_PAWN,GREEN_KING],
             [RED_KNIGHT,RED_PAWN,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,GREEN_PAWN,GREEN_KNIGHT],
             [RED_BISHOP,RED_PAWN,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,GREEN_PAWN,GREEN_BISHOP],
             [RED_ROOK,RED_PAWN,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,GREEN_PAWN,GREEN_ROOK],
             [-2,-2,-2,-1,-1,-1,-1,-1,-1,-1,-1,-2,-2,-2],
             [-2,-2,-2,BLACK_PAWN,BLACK_PAWN,BLACK_PAWN,BLACK_PAWN,BLACK_PAWN,BLACK_PAWN,BLACK_PAWN,BLACK_PAWN,-2,-2,-2],
             [-2,-2,-2,BLACK_ROOK,BLACK_BISHOP,BLACK_KNIGHT,BLACK_QUEEN,BLACK_KING,BLACK_KNIGHT,BLACK_BISHOP,BLACK_ROOK,-2,-2,-2]];

$(function() {
    pieces = new Image();
    pieces.onload = function () {
        drawBoard();
    }
    
    pieces.src = "img/figures.png";
    
});

function drawBoard() {
    canvas = document.getElementById('board');

        ctx = canvas.getContext('2d');
        BLOCK_SIZE = canvas.height / 14;
        for( var i = 0 ; i < 14 ; i++ ){
            for( var q = 0 ; q < 14 ; q++ ){

                var x = q * BLOCK_SIZE;
                var y = i * BLOCK_SIZE;
                if(board[i][q] != -2) {
                    ctx.fillStyle = getBoardColor(i,q);
                    ctx.fillRect(x,y,BLOCK_SIZE,BLOCK_SIZE);
                    if(board[i][q] != -1)
                        drawFigure(i,q);
                }

            }
            
        }
}

function drawFigure(x,y) {
    var figurePos = getPosFromFigure(board[x][y]);
    ctx.drawImage(pieces,figurePos.x, figurePos.y, 50, 50, y*50, x*50, 50, 50); 
}

function getPosFromFigure(index) {
    var y = Math.floor(index / 6);
    var x = index - (6*y);

    var position = {
        "y": y * 50,
        "x": x * 50
    };
    return position;
}

function getBoardColor(x, y) {
       return (x + y) % 2 === 0 ? '#fee472': '#00B392';
}