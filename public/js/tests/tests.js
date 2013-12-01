module("board.js");

/*
This is the testboard:

[0] [1]    [2]         [3]         [4]         [5] <--X   Y
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

test("isLegalTile(x, y)", function(){
	var board = new Board(boardArr);
	ok(board.isLegalTile(0, 0));
	ok(!board.isLegalTile(-1, 0));
	ok(!board.isLegalTile(0, -1));
	ok(board.isLegalTile(5, 3));
	ok(!board.isLegalTile(50, 2));
	ok(!board.isLegalTile(2, 50));
});

test("isPotentiallyWalkable(x, y, color)", function(){
	var board = new Board(boardArr);
	ok(!board.isPotentiallyWalkable(0, 0, Color.WHITE));
	ok(board.isPotentiallyWalkable(1, 0, Color.WHITE));
	ok(board.isPotentiallyWalkable(2, 1, Color.WHITE));
	ok(!board.isPotentiallyWalkable(3, 0, Color.WHITE));
});

test("isEnemy(x, y, color)", function(){
	var board = new Board(boardArr);
	ok(board.isEnemy(3, 2, Color.WHITE));
	ok(board.isEnemy(5, 3, Color.RED));
	ok(!board.isEnemy(0, 0, Color.WHITE));
	ok(!board.isEnemy(0, 3, Color.WHITE));
	ok(!board.isEnemy(4, 1, Color.BLACK));
});

test("getFigureAtPos(x, y)", function(){
	var board = new Board(boardArr);
	strictEqual(board.getFigureAtPos(0, 0), null);
	strictEqual(board.getFigureAtPos(3, 0), board.board[0][3]);
	strictEqual(board.getFigureAtPos(-1, 2), null);
	strictEqual(board.getFigureAtPos(5, 3), board.board[3][5]);
});

test("isFigure(tileX, tileY)", function(){
	var board = new Board(boardArr);
	ok(board.isFigure(2, 0));
	ok(board.isFigure(5, 3));
	ok(!board.isFigure(0, 3));
	ok(!board.isFigure(1, 3));
});

test("moveFigureTo(oldX, oldY, newX, newY)", function(){
	var board = new Board(boardArr);

	var oldX = 3;
	var oldY = 0;
	var newX = 1;
	var newY = 0;
	var tileFrom = board.get(oldX, oldY);
	var tileTo = board.get(newX, newY);

	ok(board.moveFigureTo(oldX, oldY, newX, newY));
	strictEqual(board.get(oldX, oldY), -1);
	strictEqual(board.get(newX, newY), tileFrom);

});