var Board = function(importedBoard){
	//-2 > No tile drawn // -1 > No figure on tile
	//stadart constructor if no board is imported
	if(typeof importedBoard === "undefined") {
		this.board = [[-2,-2,-2,new Figure(FigureType.ROOK, Color.BLACK),new Figure(FigureType.KNIGHT, Color.BLACK),new Figure(FigureType.BISHOP,Color.BLACK),new Figure(FigureType.KING,Color.BLACK),new Figure(FigureType.QUEEN,Color.BLACK),new Figure(FigureType.BISHOP,Color.BLACK),new Figure(FigureType.KNIGHT,Color.BLACK),new Figure(FigureType.ROOK,Color.BLACK),-2,-2,-2],
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
	}
	else {
		//import board
		this.board = [];
		var ylength = importedBoard.length;
		var xlength = importedBoard[0].length;
		for(var i=0; i < xlength; i++){
			this.board.push([]);
		}

		for(var y = 0; y < ylength; y++){
			for(var x = 0; x < xlength; x++){
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
};

Board.prototype.exportBoard = function (){
	var newBoard = [];
	for(var i=0; i<this.board.length;i++){
		newBoard.push([]);
	}

	for(var y = 0; y < this.board.length; y++){
		for(var x = 0; x < this.board[0].length; x++){
			if(this.isFigure(x,y)){
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

//true if the tile is in bounds of the board
Board.prototype.isLegalTile = function(x, y){
	if(x >= 0 && x < this.board.length && y >= 0 && y < this.board[0].length) return true;
	else return false;
};

//true if the tile is free or controlled by an enemy
Board.prototype.isPotentiallyWalkable = function (x, y, color){
	if(!this.isLegalTile(x, y)) return false;
	var tile = this.board[y][x];
	console.log("" + tile);
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

Board.prototype.getFigureAtPos = function(x,y){
	if(!this.isLegalTile(x, y)) return null;
	if(this.board[y][x] != -1 && this.board[y][x] != -2)
		return this.board[y][x];
	else
		return null;
};

Board.prototype.isFigure = function(tileX, tileY){
	if(this.board[tileY][tileX] !== -1 && this.board[tileY][tileX] !== -2)
		return true;
	else
		return false;
};

Board.prototype.moveFigureTo = function(oldX, oldY, newX, newY){
	if(!this.isLegalTile(oldX, oldY) || !this.isLegalTile(newX, newY)) return false;
	var temp = this.board[oldY][oldX];
	this.board[oldY][oldX] = this.board[newY][newX];
	this.board[newY][newX] = temp;
	
	if(this.getFigureAtPos(oldX, oldY) !== null)
		this.board[oldY][oldX].setPosition(oldX,oldY);
	if(this.getFigureAtPos(newX, newY) !== null)
		this.board[newY][newX].setPosition(newX,newY);
	return true;
};

Board.prototype.isPossibleToMove = function(oldPos, newPos){
    var possibleMoves = this.getFigureAtPos(oldPos.x, oldPos.y).possibleMoves(this);
    for(var i = 0; i < possibleMoves.length; i++){
        if(possibleMoves[i].x == newPos.x && possibleMoves[i].y == newPos.y){
          return true;
        }
    }
    return false;
};

//called when a figure moved
Board.prototype.isEnPassant = function(){
    for(var y = 0; y < myBoard.board[0].length; y++){
        for(var x = 0; x < myBoard.board.length; x++){
            if(myBoard.isFigure(x, y)){
                if(myBoard.board[y][x].enPassant){
                    var behind = {"x": x + myBoard.board[y][x].behind().x, "y": y + myBoard.board[y][x].behind().y};
                    if(myBoard.isEnemy(behind.x, behind.y)){
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