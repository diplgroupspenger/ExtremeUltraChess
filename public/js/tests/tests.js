module("board.js");

/*
This is the testboard:

[0] [1]    [2]         [3]         [4]         [5] <--Y   X
_____________________________________________________     
-2, -1, whitepawn,	whitepawn,	whitepawn,	whitepawn	|[0]
-2, -1, blackpawn,	blackpawn,	blackpawn,	blackpawn	|[1]
-2, -1, redpawn,	redpawn,	redpawn,	redpawn		|[2]
-2, -1, greenpawn,	greenpawn,	greenpawn,	greenpawn	|[3]
*/
var boardArr = [
	[-2, -1, new Figure(FigureType.PAWN, Color.WHITE), new Figure(FigureType.PAWN, Color.WHITE), new Figure(FigureType.PAWN, Color.WHITE), new Figure(FigureType.PAWN, Color.WHITE)],
	[-2, -1, new Figure(FigureType.PAWN, Color.BLACK), new Figure(FigureType.PAWN, Color.BLACK), new Figure(FigureType.PAWN, Color.BLACK), new Figure(FigureType.PAWN, Color.BLACK)],
	[-2, -1, new Figure(FigureType.PAWN, Color.RED), new Figure(FigureType.PAWN, Color.RED), new Figure(FigureType.PAWN, Color.RED), new Figure(FigureType.PAWN, Color.RED)],
	[-2, -1, new Figure(FigureType.PAWN, Color.GREEN), new Figure(FigureType.PAWN, Color.GREEN), new Figure(FigureType.PAWN, Color.GREEN), new Figure(FigureType.PAWN, Color.GREEN)]
];

test("isLegalTile()", function(){
	var board = new Board(boardArr);
	ok(board.isLegalTile(0, 0));
	ok(!board.isLegalTile(-1, 0));
	ok(!board.isLegalTile(0, -1));
	ok(board.isLegalTile(3, 4));
	ok(!board.isLegalTile(50, 2));
	ok(!board.isLegalTile(2, 50));
});

test("isPotentiallyWalkable()", function(){
	var board = new Board();

});