module("board.js");

/*
This is the testboard boardArr:

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

var boardArr2 = [
	[-2, new Figure(FigureType.KNIGHT, Color.WHITE), -1, -1, -2],
	[-1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1],
	[-2, -1, -1, -1, -2],
];

test("isLegalTile(x, y)", function(){
	myBoard = new Board(boardArr);

	ok(myBoard.isLegalTile(0, 0));
	ok(myBoard.isLegalTile(5, 3));

	ok(!myBoard.isLegalTile(-1, 0));
	ok(!myBoard.isLegalTile(0, -1));
	ok(!myBoard.isLegalTile(50, 2));
	ok(!myBoard.isLegalTile(2, 50));
	ok(!myBoard.isLegalTile(2, 5));
});

test("isPotentiallyWalkable(x, y, color)", function(){
	myBoard = new Board(boardArr);
	ok(!myBoard.isPotentiallyWalkable(0, 0, Color.WHITE));
	ok(myBoard.isPotentiallyWalkable(1, 0, Color.WHITE));
	ok(myBoard.isPotentiallyWalkable(2, 1, Color.WHITE));
	ok(!myBoard.isPotentiallyWalkable(3, 0, Color.WHITE));
});

test("isEnemy(x, y, color)", function(){
	myBoard = new Board(boardArr);
	ok(myBoard.isEnemy(3, 2, Color.WHITE));
	ok(myBoard.isEnemy(5, 3, Color.RED));
	ok(!myBoard.isEnemy(0, 0, Color.WHITE));
	ok(!myBoard.isEnemy(0, 3, Color.WHITE));
	ok(!myBoard.isEnemy(4, 1, Color.BLACK));
});

test("getFigureAtPos(x, y)", function(){
	myBoard = new Board(boardArr);
	strictEqual(myBoard.getFigureAtPos(0, 0), null);
	deepEqual(myBoard.getFigureAtPos(3, 0), myBoard.board[0][3]);
	strictEqual(myBoard.getFigureAtPos(-1, 2), null);
	strictEqual(myBoard.getFigureAtPos(5, 3), myBoard.board[3][5]);
});

test("isFigure(tileX, tileY)", function(){
	myBoard = new Board(boardArr);
	ok(myBoard.isFigure(2, 0));
	ok(myBoard.isFigure(5, 3));
	ok(!myBoard.isFigure(0, 3));
	ok(!myBoard.isFigure(1, 3));
	ok(!myBoard.isFigure(5, 5));
});

test("moveFigureTo(oldX, oldY, newX, newY)", function(){
	myBoard = new Board(boardArr);

	var oldX = 3;
	var oldY = 0;
	var newX = 1;
	var newY = 0;
	var tileFrom = myBoard.get(oldX, oldY);
	var tileTo = myBoard.get(newX, newY);

	ok(myBoard.moveFigureTo(oldX, oldY, newX, newY));
	strictEqual(myBoard.get(oldX, oldY), -1);
	strictEqual(myBoard.get(newX, newY), tileFrom);

	oldX = newX;
	oldY = newY;
	newX = 2;
	newY = 5;

	ok(!myBoard.moveFigureTo(oldX, oldY, newX, newY));
});

test("isPossibleToMove(oldPos, newPos)", function(){
	myBoard = new Board(boardArr2);

	var oldPos = {x: 1, y: 0};
	var newPos = {x: 2, y: 2};

	ok(myBoard.isPossibleToMove(oldPos, newPos));

	myBoard = new Board(boardArr);

	oldPos = {x: 2, y: 3};
	newPos = {x: 1, y: 3};

	ok(myBoard.isPossibleToMove(oldPos, newPos));

	newPos = {x: 3, y: 3};
	ok(!myBoard.isPossibleToMove(oldPos, newPos));
	oldPos = {x: 2, y: 2};
	newPos = {x: 1, y: 2};
	ok(!myBoard.isPossibleToMove(oldPos, newPos));

});