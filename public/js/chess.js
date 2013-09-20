var WHITE_KING = "wKing";
var WHITE_QUEEN = "wQueen";
var WHITE_ROOK = "wRook";
var WHITE_BISHOP = "wBishop";
var WHITE_KNIGHT = "wKnight";
var WHITE_PAWN = "wPawn";

//sdfsfd
 
var BLACK_KING = "bKing";
var BLACK_QUEEN = "bQueen";
var BLACK_ROOK = "bRook";
var BLACK_BISHOP = "bBishop";
var BLACK_KNIGHT = "bKnight";
var BLACK_PAWN = "bPawn";

var RED_KING = "rKing";
var RED_QUEEN = "rQueen";
var RED_ROOK = "rRook";
var RED_BISHOP = "rBishop";
var RED_KNIGHT = "rKnight";
var RED_PAWN = "rPawn";

var GREEN_KING = "gKing";
var GREEN_QUEEN = "gQueen";
var GREEN_ROOK = "gRook";
var GREEN_BISHOP = "gBishop";
var GREEN_KNIGHT = "gKnight";
var GREEN_PAWN = "gPawn";

var EMPTY = -1;

var board = [[-1,-1,-1,WHITE_ROOK,WHITE_BISHOP,WHITE_KNIGHT,WHITE_QUEEN,WHITE_KING,WHITE_KNIGHT,WHITE_BISHOP,WHITE_ROOK,-1,-1,-1],
             [-1,-1,-1,WHITE_PAWN,WHITE_PAWN,WHITE_PAWN,WHITE_PAWN,WHITE_PAWN,WHITE_PAWN,WHITE_PAWN,WHITE_PAWN,-1,-1,-1],
             [-1,-1,-1,0,0,0,0,0,0,0,0,-1,-1,-1],
             [RED_ROOK,RED_PAWN,0,0,0,0,0,0,0,0,0,0,GREEN_PAWN,GREEN_ROOK],
             [RED_BISHOP,RED_PAWN,0,0,0,0,0,0,0,0,0,0,GREEN_PAWN,GREEN_BISHOP],
             [RED_KNIGHT,RED_PAWN,0,0,0,0,0,0,0,0,0,0,GREEN_PAWN,GREEN_KNIGHT],
             [RED_QUEEN,RED_PAWN,0,0,0,0,0,0,0,0,0,0,GREEN_PAWN,GREEN_QUEEN],
             [RED_KING,RED_PAWN,0,0,0,0,0,0,0,0,0,0,GREEN_PAWN,GREEN_KING],
             [RED_KNIGHT,RED_PAWN,0,0,0,0,0,0,0,0,0,0,GREEN_PAWN,GREEN_KNIGHT],
             [RED_BISHOP,RED_PAWN,0,0,0,0,0,0,0,0,0,0,GREEN_PAWN,GREEN_BISHOP],
             [RED_ROOK,RED_PAWN,0,0,0,0,0,0,0,0,0,0,GREEN_PAWN,GREEN_ROOK],
             [-1,-1,-1,0,0,0,0,0,0,0,0,-1,-1,-1],
             [-1,-1,-1,BLACK_PAWN,BLACK_PAWN,BLACK_PAWN,BLACK_PAWN,BLACK_PAWN,BLACK_PAWN,BLACK_PAWN,BLACK_PAWN,-1,-1,-1],
             [-1,-1,-1,BLACK_ROOK,BLACK_BISHOP,BLACK_KNIGHT,BLACK_QUEEN,BLACK_KING,BLACK_KNIGHT,BLACK_BISHOP,BLACK_ROOK,-1,-1,-1]];

$(function() {
    drawBoard(board);
});

function drawBoard(board) {
    var str = '';
    for( var i = 0 ; i < board.length ; i++ ){
        str += '<div class="row">';
        for( var q = 0 ; q < board.length ; q++ ){

            var color = getBoardColor(i, q);

            str += '<div class="column ' +
            color + '">' +
            '<div class="' + board[i][q] + '"></div>' +
            '</div>';

        }
        str += '</div>';
    }
    $('#board').append(str);
}

function getBoardColor(x, y) {
    if(board[x][y] != -1)
       return (x + y) % 2 === 0 ? 'light': 'dark';
	
}