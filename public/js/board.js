var Board = function(){
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

};

Board.prototype.isLegalField = function(x, y){
  if(x >= 0 && x < this.board.length && y >= 0 && y < this.board.length) return true;
  else return false;
};

Board.prototype.isPotentiallyWalkable = function (x, y, color){
    var tile = this.board[y][x];
    if(tile != -2 && (tile == -1 || tile.color != color)){
        return true;
    }
    return false;
};

Board.prototype.isEnemy = function (x, y, color){
    if(!this.isPotentiallyWalkable(x, y, color)) return false;
    else{
      if(this.board[y][x] != -1) return true;
    }
    return false;
};

Board.prototype.getFigureAtPos = function(x,y) {
      if(this.board[y][x] != -1 && this.board[y][x] != -2)
          return this.board[y][x];
      else
          return null;
};

//only figures are legal
Board.prototype.clickIsLegal = function(tileX, tileY){
      if(this.board[tileY][tileX]!= -1 && this.board[tileY][tileX]!= -2)
          return true;
      else
          return false;
};

Board.prototype.moveFigureTo = function(oldX, oldY, newX, newY){
 
    var temp = this.board[oldY][oldX];
    this.board[oldY][oldX] = this.board[newY][newX];
    this.board[newY][newX] = temp;
    
    if(this.getFigureAtPos(oldX, oldY) !== null){
      this.board[oldY][oldX].setPosition(oldX,oldY);
      console.log("color: "+this.board[oldY][oldX].color);
    }
    if(this.getFigureAtPos(newX, newY) !== null){
      this.board[newY][newX].setPosition(newX,newY);
      console.log("color: "+this.board[newY][newX].color);
    }

      console.log("oldX: "+oldX + " oldY: "+oldY);
      console.log("newX: "+newX + " newY: "+newY);
};