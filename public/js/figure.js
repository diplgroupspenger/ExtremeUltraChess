function Figure(type, color) {
    this.type = type;
    this.color = color;
    this.figure; //kineticjs object
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
    	possibleMoves: function(board) {
    		var posX = this.x;
    		var posY = this.y;

            var positions = new Array();
            /*
            if(board[posY-1][posX].color != this.color){
                positions.push({x: posX,y:posY-1});
            }
            if(board[posY-1][posX-1].type.id == 0) {
                positions.push({x: posX-1,y:posY-1});
            } else if(board[posY-1][posX+1].type.id == 0)
            positions.push({x: posX+1,y:posY-1});
*/
            return positions;
        },
        id: 0,
        name: 'Pawn'
    },
    KNIGHT: {
		possibleMoves: function(board) {
			console.log("KNIGHT");
            return {
                x: 0,
                y: 0
            };
        },
        id: 1,
        name: 'Knight'
    },
    BISHOP: {
		possibleMoves: function(board) {
            console.log("BISHOP");
            return {
                x: 0,
                y: 0
            };
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