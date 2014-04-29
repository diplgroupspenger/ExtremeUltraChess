var Board = function(importedBoard){
	var x = 0;
	var y = 0;
	this.isVirtual = false;
	//-2 > No tile drawn // -1 > No figure on tile
	//stadart constructor if no board is imported
	if(typeof importedBoard === "undefined") {
		this.board = [[-2,-2,-2,new Figure(FigureType.ROOK, Color.BLACK),new Figure(FigureType.KNIGHT, Color.BLACK),new Figure(FigureType.BISHOP,Color.BLACK),new Figure(FigureType.KING,Color.BLACK),new Figure(FigureType.QUEEN,Color.BLACK),new Figure(FigureType.BISHOP,Color.BLACK),new Figure(FigureType.KNIGHT,Color.BLACK),new Figure(FigureType.ROOK,Color.BLACK),-2,-2,-2],
		[-2,-2,-2,new Figure(FigureType.PAWN,Color.BLACK),new Figure(FigureType.PAWN,Color.BLACK),new Figure(FigureType.PAWN,Color.BLACK),new Figure(FigureType.PAWN,Color.BLACK),new Figure(FigureType.PAWN,Color.BLACK),new Figure(FigureType.PAWN,Color.BLACK),new Figure(FigureType.PAWN,Color.BLACK),new Figure(FigureType.PAWN,Color.BLACK),-2,-2,-2],
		[-2,-2,-2,-1,-1,-1,new Figure(FigureType.PAWN, Color.WHITE),-1,-1,-1,-1,-2,-2,-2],
		[new Figure(FigureType.ROOK,Color.RED),new Figure(FigureType.PAWN,Color.RED),-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,new Figure(FigureType.PAWN,Color.GREEN),new Figure(FigureType.ROOK,Color.GREEN)],
		[new Figure(FigureType.KNIGHT,Color.RED),new Figure(FigureType.PAWN,Color.RED),-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,new Figure(FigureType.PAWN,Color.GREEN),new Figure(FigureType.KNIGHT,Color.GREEN)],
		[new Figure(FigureType.BISHOP,Color.RED),new Figure(FigureType.PAWN,Color.RED),-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,new Figure(FigureType.PAWN,Color.GREEN),new Figure(FigureType.BISHOP,Color.GREEN)],
		[new Figure(FigureType.KING,Color.RED),new Figure(FigureType.PAWN,Color.RED),-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,new Figure(FigureType.PAWN,Color.GREEN),new Figure(FigureType.QUEEN,Color.GREEN)],
		[new Figure(FigureType.QUEEN,Color.RED),new Figure(FigureType.PAWN,Color.RED),new Figure(FigureType.PAWN, Color.GREEN),-1,-1,-1,-1,-1,-1,-1,-1,-1,new Figure(FigureType.PAWN,Color.GREEN),new Figure(FigureType.KING,Color.GREEN)],
		[new Figure(FigureType.BISHOP,Color.RED),new Figure(FigureType.PAWN,Color.RED),-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,new Figure(FigureType.PAWN,Color.GREEN),new Figure(FigureType.BISHOP,Color.GREEN)],
		[new Figure(FigureType.KNIGHT,Color.RED),new Figure(FigureType.PAWN,Color.RED),-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,new Figure(FigureType.PAWN,Color.GREEN),new Figure(FigureType.KNIGHT,Color.GREEN)],
		[new Figure(FigureType.ROOK,Color.RED),new Figure(FigureType.PAWN,Color.RED),-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,new Figure(FigureType.PAWN,Color.GREEN),new Figure(FigureType.ROOK,Color.GREEN)],
		[-2,-2,-2,-1,-1,-1,-1,-1,-1,-1,-1,-2,-2,-2],
		[-2,-2,-2,new Figure(FigureType.PAWN,Color.WHITE),new Figure(FigureType.PAWN,Color.WHITE),new Figure(FigureType.PAWN,Color.WHITE),new Figure(FigureType.PAWN,Color.WHITE),new Figure(FigureType.PAWN,Color.WHITE),new Figure(FigureType.PAWN,Color.WHITE),new Figure(FigureType.PAWN,Color.WHITE),new Figure(FigureType.PAWN,Color.WHITE),-2,-2,-2],
		[-2,-2,-2,new Figure(FigureType.ROOK,Color.WHITE),new Figure(FigureType.KNIGHT,Color.WHITE),new Figure(FigureType.BISHOP,Color.WHITE),new Figure(FigureType.QUEEN,Color.WHITE),new Figure(FigureType.KING,Color.WHITE),new Figure(FigureType.BISHOP,Color.WHITE),new Figure(FigureType.KNIGHT,Color.WHITE),new Figure(FigureType.ROOK,Color.WHITE),-2,-2,-2]];
	}
	else {
		//import board
		this.board = [];
		var ylength = importedBoard.length;
		var xlength = importedBoard[0].length;
		for(var i = 0; i < ylength; i++){
			this.board.push([]);
		}

		for(y = 0; y < ylength; y++){
			for(x = 0; x < xlength; x++){
				exportedFigure = importedBoard[y][x];
				if(exportedFigure === -1)
					this.board[y][x] = -1;
				else if(exportedFigure === -2)
					this.board[y][x] = -2;
				else
					this.board[y][x] = new Figure(null, null,exportedFigure);
			}
		}
	}

	for(y = 0; y < this.board.length; y++){
		for(x = 0; x < this.board[0].length; x++){
			if(this.board[y][x] !== -1 && this.board[y][x] !== -2){
				this.board[y][x].setPositionRelentless(x, y);
			}
		}
	}

	this.checkedTiles = [];

};

Board.prototype.createVirtualBoard = function(kingX, kingY){
	var virtualBoard = new Board(this.exportBoard());
	virtualBoard.set(kingX, kingY, -1);
	virtualBoard.isVirtual = true;
	return virtualBoard;
};

//calculates the checked tiles of all figures on the board
Board.prototype.initCheckedTiles = function(){
	//var start = new Date().getTime();
	this.checkedTiles = [];
	for(var y = 0; y < this.board.length; y++){
		for (var x = 0; x < this.board.length; x++) {
			if(this.isFigure(x, y)){
				this.pushByPosition(x, y);
			}
		}
	}
	//var end = new Date().getTime();
	//var time = end - start;
	//console.log("EXECUTION TIME: " + time + "ms");
};

//updates the checked tiles when a figure is moved - abandoned for later
//Board.prototype.updateCheckedTiles = function(x, y, onlyRemove){
//	for(var i = 0; i < this.checkedTiles.length; i++){
//		if(this.checkedTiles[i].figure == this.get(x, y)){
//			console.log("UPDATESPLICE");
//			this.checkedTiles.splice(i, 1);
//		}
//	}
//	if(!onlyRemove)
//		this.pushByPosition(x, y);
//};

Board.prototype.pushByPosition = function(x, y){
	var figure = this.get(x, y);
	//console.log("posX: " + x + " posY: " + y);
	//console.log("length: " + possibleMoves.length);
	if(figure.type !== FigureType.PAWN){
		var possibleMoves = figure.possibleMoves(this);
		for(var i = 0; i < possibleMoves.length; i++){
			var posX = possibleMoves[i].x;
			var posY = possibleMoves[i].y;
			var json = {x: posX, y: posY, figure: figure};
			this.checkedTiles.push(json);
			//if(typeof _.findWhere(this.checkedTiles, json) == "undefined"){
			//
			//}
		}
	}
	else{
		var inFront = {x: figure.x + figure.inFront().x, y: figure.y + figure.inFront().y};
		var leftFront =  {x: inFront.x + figure.left().x, y: inFront.y + figure.left().y};
		var rightFront = {x: inFront.x + figure.right().x, y: inFront.y + figure.right().y};
		var json1 = {x: leftFront.x, y: leftFront.y, figure: figure};
		var json2 = {x: rightFront.x, y: rightFront.y, figure: figure};

		if(this.isLegalTile(json1.x, json1.y) && this.get(json1.x, json1.y) !== -2)
			this.checkedTiles.push(json1);
		if(this.isLegalTile(json2.x, json2.y) && this.get(json2.x, json2.y) !== -2)
			this.checkedTiles.push(json2);
	}
};

Board.prototype.exportBoard = function (){
	var newBoard = [];
	for(var i = 0; i < this.board.length;i++){
		newBoard.push([]);
	}

	for(var y = 0; y < this.board.length; y++){
		for(var x = 0; x < this.board[0].length; x++){
			if(this.isFigure(x, y)){
				newBoard[y][x] = this.board[y][x].exportFigure();
		} else {
				newBoard[y][x] = this.board[y][x];
			}
		}
	}

	return newBoard;
};

Board.prototype.get = function(x, y){
	return this.board[y][x];
};

Board.prototype.set = function(x, y, value){
	this.board[y][x] = value;
};

//true if the tile is in bounds of the board
Board.prototype.isLegalTile = function(x, y){
	if(x >= 0 && x < this.board[0].length && y >= 0 && y < this.board.length) return true;
	else return false;
};

//true if the tile is free or controlled by an enemy
Board.prototype.isPotentiallyWalkable = function (x, y, color){
	if(!this.isLegalTile(x, y)) return false;
	var tile = this.board[y][x];

	if(tile !== -2 && (tile === -1 || tile.color !== color))
		return true;
	else
		return false;
};

//true if the tile is controlled by an enemy
Board.prototype.isEnemy = function (x, y, color){
	if(!this.isPotentiallyWalkable(x, y, color)) return false;
	else if(this.board[y][x] !== -1)
		return true;
	else
		return false;
};

//returns the figure-object of a position or null if no figure is on the position
Board.prototype.getFigureAtPos = function(x,y){
	if(!this.isLegalTile(x, y)) return null;
	if(this.board[y][x] !== -1 && this.board[y][x] !== -2)
		return this.board[y][x];
	else
		return null;
};

//true if there is a figure on the tile
Board.prototype.isFigure = function(x, y){
	if(this.board[y] !== undefined && typeof this.get(x, y) == "object")
		return true;
	else
		return false;
};

//moves a figure from one position to another, returns false if the old or new position isn't legal
Board.prototype.moveFigureTo = function(oldX, oldY, newX, newY){
	if(!this.isLegalTile(oldX, oldY) || !this.isLegalTile(newX, newY)) return false;
	var temp = this.get(oldX, oldY);
	this.board[oldY][oldX] = this.get(newX, newY);
	this.board[newY][newX] = temp;

	if(this.getFigureAtPos(oldX, oldY) !== null)
		this.get(oldX, oldY).setPosition(oldX, oldY, this);
	if(this.getFigureAtPos(newX, newY) !== null)
		this.get(newX, newY).setPosition(newX, newY, this);
	return true;
};

//returns true if the figure at oldPos is allowed to move to newPos
//returns false if there is no figure at oldPos or the figure is not allwed to move to newPos
Board.prototype.isPossibleToMove = function(oldPos, newPos){
    var possibleMoves = this.getFigureAtPos(oldPos.x, oldPos.y).possibleMoves(this,oldPos);
    for(var i = 0; i < possibleMoves.length; i++){
        if(possibleMoves[i].x === newPos.x && possibleMoves[i].y === newPos.y){
			return true;
        }
    }
    return false;
};

//called when a figure is moved
Board.prototype.isEnPassant = function(){
    for(var y = 0; y < this.board[0].length; y++){
        for(var x = 0; x < this.board.length; x++){
            if(this.isFigure(x, y)){
                if(this.board[y][x].enPassant){
                    var behind = {x: x + this.board[y][x].behind().x, y: y + this.board[y][x].behind().y};
                    if(this.isEnemy(behind.x, behind.y)){
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

//check for node
if(typeof module !== 'undefined' && module.exports) {
	var FigureType = require('./figureType.js');
	var Color = require('./color.js');
	var Figure = require('./figure.js');
	module.exports = Board;
}
