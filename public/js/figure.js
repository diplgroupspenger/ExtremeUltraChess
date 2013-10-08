function Figure(type, color) {
    this.type = type;
    this.color = color;
    this.x;
    this.y;
}

Figure.prototype.possibleMoves = function(board) {
    return this.type.possibleMoves.call(this,board);
    this.type.call(this);
}

Figure.prototype.setPosition = function(x,y) {
    this.x = x;
    this.y = y;
}

var FigureType = {
    PAWN: {
    	possibleMoves: function(myBoard) {
    		var posX = this.x;
    		var posY = this.y;
            console.log("PAWN " +this.color + " x: "+posX+ " y: "+posY);
            var positions = new Array();

            //enemy infront
            if(myBoard.getFigureAtPos(posX,posY-1) !=null){
                if(myBoard.board[posY-1][posX].color != this.color)
                    positions.push({x: posX,y:posY-1});
            } else { //nothing infront
                //Starting Position
                if(posY = 12){
                    if(myBoard.getFigureAtPos(posX, posY-2) == null){
                    positions.push({x: posX, y: posY-2});
                    } else {
                        console.log(this.color +"enemycolor "+myBoard.board[posY-2][posX].color);
                        if(myBoard.board[posY-2][posX].color != this.color){
                            positions.push({x: posX, y: posY-2});
                        }
                    }
                }
                positions.push({x: posX,y:posY-1});
            }
            //enemy left-front
            if(myBoard.getFigureAtPos(posX-1,posY-1) !=null){
                console.log("newPoscolor: "+myBoard.board[posY-1][posX-1].color+ " currentCOlor: "+this.color);
                if(myBoard.board[posY-1][posX-1].color != this.color)
                    positions.push({x: posX-1,y:posY-1});
            }
            //enemy right-front
            if(myBoard.getFigureAtPos(posX+1,posY-1) !=null){
                if(myBoard.board[posY-1][posX+1].color != this.color)
                    positions.push({x: posX+1,y:posY-1});
            }
            return positions;
        },
        id: 0,
        name: 'Pawn'
    },
    KNIGHT: {
		possibleMoves: function(board) {
			 
            var posX = this.x;
            var posY = this.y;
            var positions = new Array();
            console.log("KNIGHT " +this.color + " x: "+posX+ " y: "+posY);
            //up left
            if(myBoard.getFigureAtPos(posX-1,posY-2) == null){
                positions.push({x: posX-1,y:posY-2});
            } else {
                if(myBoard.board[posY-2][posX+1].color != this.color){
                    positions.push({x: posX+1,y:posY-2});
                }
            }

            //up right
            if(myBoard.getFigureAtPos(posX+1,posY-2) == null){
                positions.push({x: posX+1,y:posY-2});
            } else {
                if(myBoard.board[posY-2][posX+1].color != this.color){
                    positions.push({x: posX+1,y:posY-2});
                }
            }

            if(myBoard.getFigureAtPos(posX-2,posY-1) == null){
                positions.push({x: posX-2,y:posY-1});
            } else {
                if(myBoard.board[posY-1][posX-2].color != this.color){
                    positions.push({x: posX-2,y:posY-1});
                }
            }

            if(myBoard.getFigureAtPos(posX+2,posY-1) == null){
                positions.push({x: posX+2,y:posY-1});
            } else {
                if(myBoard.board[posY-1][posX+2].color != this.color){
                    positions.push({x: posX+2,y:posY-1});
                }
            }

            if(myBoard.getFigureAtPos(posX-2,posY+1) == null){
                positions.push({x: posX-2,y:posY+1});
            } else {
                if(myBoard.board[posY+1][posX-2].color != this.color){
                    positions.push({x: posX-2,y:posY+1});
                }
            }
            
            if(myBoard.getFigureAtPos(posX+2,posY+1) == null){
                positions.push({x: posX+2,y:posY+1});
            } else {
                if(myBoard.board[posY+1][posX+2].color != this.color){
                    positions.push({x: posX+2,y:posY+1});
                }
            }

            if(myBoard.getFigureAtPos(posX-1,posY+2) == null){
                positions.push({x: posX-1,y:posY+2});
            } else {
                if(myBoard.board[posY+2][posX-1].color != this.color){
                    positions.push({x: posX-1,y:posY+2});
                }
            }

            if(myBoard.getFigureAtPos(posX+1,posY+2) == null){
                positions.push({x: posX+1,y:posY+2});
            } else {
                if(myBoard.board[posY+2][posX+1].color != this.color){
                    positions.push({x: posX+1,y:posY+2});
                }
            }

            return positions;
        },
        id: 1,
        name: 'Knight'
    },
    BISHOP: {
		possibleMoves: function(board) {
            console.log("BISHOP");
            var posX = this.x;
            var posY = this.y;
            var positions = {};

            return positions;
        },
        id: 2,
        name: 'Bishop'
    },
    QUEEN: {
        possibleMoves: function(board) {
            console.log("QUEEN");
            return {
                x: 0,
                y: 0
            };
        },
        id: 3,
        name: 'Queen'
    },
    KING: {
        possibleMoves: function(board) {
            console.log("KING");
            return {
                x: 0,
                y: 0
            };
        },
        id: 4,
        name: 'King'
    },
    ROOK: {
    	possibleMoves: function(board) {
            console.log("ROOK");
            return {
                x: 0,
                y: 0
            };
        },
        id: 5,
        name: 'Rook'
    }
};