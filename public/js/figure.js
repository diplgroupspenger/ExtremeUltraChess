var Figure = function(type, color) {
    this.type = type;
    this.color = color;
    this.x;
    this.y;
}

Figure.prototype.possibleMoves = function() {
    return this.type.possibleMoves.call(this);
    this.type.call(this);
}

var FigureType = {
    PAWN: {
    	possibleMoves: function() {
    		var posX = this.x;
    		var posY = this.y;
    		if(this.color== Color.WHITE){
    			posY = this.y -1;
       		} else if(this.color == Color.BLACK){
       			posY = this.y +1;
       		} else if(this.color == Color.RED){
       			posX = this.x +1;
       		} else if(this.color == Color.GREEN){
       			posX = this.x -1;
       		}
            return {
                x: posX,
                y: posY
            };
        },
        id: 0
    },
    KNIGHT: {
		possibleMoves: function() {
			
            return {
                x: 0,
                y: 0
            };
        },
        id: 1
    },
    BISHOP: {
		possibleMoves: function() {
 
            return {
                x: 0,
                y: 0
            };
        },
        id: 2
    },
    QUEEN: {
        possibleMoves: function() {

            return {
                x: 0,
                y: 0
            };
        },
        id: 3
    },
    KING: {
        possibleMoves: function() {

            return {
                x: 0,
                y: 0
            };
        },
        id: 4
    },
    ROOK: {
    	possibleMoves: function() {
   
            return {
                x: 0,
                y: 0
            };
        },
        id: 5
    }
};