function Figure(type, color) {
    this.type = type;
    this.color = color;
    this.x;
    this.y;
    this.hasMoved = false;
    this.enPassant = false;
}

Figure.prototype.possibleMoves = function(board) {
    return this.type.possibleMoves.call(this,board);
    this.type.call(this);
}

Figure.prototype.setPosition = function(x,y) {
    for(var i = 0; i < figureList.length; i++){
        if(figureList[i].figure.color === this.color){
            console.log("enPassant is FALSE");
            figureList[i].figure.enPassant = false;
        }
    }
    if(this.type == FigureType.PAWN && ((this.x + 2 * this.inFront().x === x && this.inFront().x != 0)
        || (this.y + 2 * this.inFront().y === y  && this.inFront().y != 0))){
        console.log("enPassant is true");
        this.enPassant = true;
    }
    this.x = x;
    this.y = y;
    this.hasMoved = true;
}

Figure.prototype.inFront = function(){
    switch(this.color){
        case Color.WHITE: return {"x" : 0, "y" : -1}; break;
        case Color.BLACK: return {"x" : 0, "y" : 1}; break;
        case Color.RED: return {"x" : 1, "y" : 0}; break;
        case Color.GREEN: return {"x" : -1, "y" : 0}; break;
    }
}

Figure.prototype.behind = function(){
    switch(this.color){
        case Color.WHITE: return {"x" : 0, "y" : 1}; break;
        case Color.BLACK: return {"x" : 0, "y" : -1}; break;
        case Color.RED: return {"x" : -1, "y" : 0}; break;
        case Color.GREEN: return {"x" : 1, "y" : 0}; break;
    }
}

Figure.prototype.left = function(){
    switch(this.color){
        case Color.WHITE: return {"x" : -1, "y" : 0}; break;
        case Color.BLACK: return {"x" : 1, "y" : 0}; break;
        case Color.RED: return {"x" : 0, "y" : -1}; break;
        case Color.GREEN: return {"x" : 0, "y" : 1}; break;
    }
}

Figure.prototype.right = function(){
    switch(this.color){
        case Color.WHITE: return {"x" : 1, "y" : 0}; break;
        case Color.BLACK: return {"x" : -1, "y" : 0}; break;
        case Color.RED: return {"x" : 0, "y" : 1}; break;
        case Color.GREEN: return {"x" : 0, "y" : -1}; break;
    }
}

var FigureType = {
    PAWN: {
    	possibleMoves: function(myBoard) {
    		var posX = this.x;
    		var posY = this.y;
            console.log("PAWN " + this.color + " x: " + posX + " y: " + posY);
            var positions = [];

            var inFront = {"x": posX + this.inFront().x, "y": posY + this.inFront().y};
            var inFront2 = {"x": inFront.x + this.inFront().x, "y": inFront.y + this.inFront().y};

            //nothing infront
            if(myBoard.board[inFront.y][inFront.x] === -1){
                positions.push(inFront);

                //check if the double-move is available
                if(!this.hasMoved){
                    if(myBoard.board[inFront2.y][inFront2.x] === -1){
                        positions.push(inFront2);
                    }
                }
            }
            

            var leftFront =  {"x": inFront.x + this.left().x, "y": inFront.y + this.left().y};
            var rightFront = {"x": inFront.x + this.right().x, "y": inFront.y + this.right().y};

            //check for enemies in attack range
            if(myBoard.isEnemy(leftFront.x, leftFront.y, this.color)){
                positions.push(leftFront);
            }
            if(myBoard.isEnemy(rightFront.x, rightFront.y, this.color)){
                positions.push(rightFront);
            }

            var left = {"x": posX + this.left().x, "y": posY + this.left().y};
            var right = {"x": posX + this.right().x, "y": posY + this.right().y};

            //check for en passant

            if(myBoard.isEnemy(left.x, left.y, this.color)){
                console.log("enemy is left");
                console.log("enemys enPassant:" + myBoard.getFigureAtPos(left.x, left.y).enPassant);
                if(myBoard.getFigureAtPos(left.x, left.y).enPassant){
                    positions.push(leftFront);
                }
            }
            if(myBoard.isEnemy(right.x, right.y, this.color)){
                console.log("enemy is right");
                if(myBoard.getFigureAtPos(right.x, right.y).enPassant){
                    positions.push(rightFront);
                }
            }

            return positions;
        },
        id: 0,

    },
    KNIGHT: {
		possibleMoves: function(myBoard) {

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
		possibleMoves: function(myBoard) {
            console.log("BISHOP");
            var posX = this.x;
            var posY = this.y;
            var positions = [];



            return positions;
        },
        id: 2,
        name: 'Bishop'
    },
    QUEEN: {
        possibleMoves: function(myBoard) {
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
        possibleMoves: function(myBoard) {
            console.log("KING");
            var positions = new Array();

            //enemy infront
            if(myBoard.getFigureAtPos(posX,posY-1) !=null){
                if(myBoard.board[posY-1][posX].color != this.color)
                    positions.push({x: posX,y:posY-1});
            } else { //nothing infront
                positions.push({x: posX,y:posY-1});
            }
            //enemy left-front
            if(myBoard.getFigureAtPos(posX-1,posY-1) !=null){
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
        id: 4,
        name: 'King'
    },
    ROOK: {
    	possibleMoves: function(myBoard) {
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