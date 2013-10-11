
function Figure(type, color) {
    this.type = type;
    this.color = color;
    this.x = 0;
    this.y = 0;
    this.hasMoved = false;
    this.enPassant = false;
}

Figure.prototype.possibleMoves = function(board) {
    return this.type.possibleMoves.call(this,board);
};

Figure.prototype.setPosition = function(x,y) {
    for(var i = 0; i < figureList.length; i++){
        if(figureList[i].figure.color === this.color){
            figureList[i].figure.enPassant = false;
        }
    }
    if(this.type == FigureType.PAWN && ((this.x + 2 * this.inFront().x === x && this.inFront().x !== 0) ||
     (this.y + 2 * this.inFront().y === y  && this.inFront().y !== 0))){
        this.enPassant = true;
    }
    this.x = x;
    this.y = y;
    this.hasMoved = true;
};

Figure.prototype.inFront = function(){
    switch(this.color){
        case Color.WHITE: return {"x" : 0, "y" : -1};
        case Color.BLACK: return {"x" : 0, "y" : 1};
        case Color.RED: return {"x" : 1, "y" : 0};
        case Color.GREEN: return {"x" : -1, "y" : 0};
    }
};

Figure.prototype.behind = function(){
    switch(this.color){
        case Color.WHITE: return {"x" : 0, "y" : 1};
        case Color.BLACK: return {"x" : 0, "y" : -1};
        case Color.RED: return {"x" : -1, "y" : 0};
        case Color.GREEN: return {"x" : 1, "y" : 0};
    }
};

Figure.prototype.left = function(){
    switch(this.color){
        case Color.WHITE: return {"x" : -1, "y" : 0};
        case Color.BLACK: return {"x" : 1, "y" : 0};
        case Color.RED: return {"x" : 0, "y" : -1};
        case Color.GREEN: return {"x" : 0, "y" : 1};
    }
};

Figure.prototype.right = function(){
    switch(this.color){
        case Color.WHITE: return {"x" : 1, "y" : 0};
        case Color.BLACK: return {"x" : -1, "y" : 0};
        case Color.RED: return {"x" : 0, "y" : 1};
        case Color.GREEN: return {"x" : 0, "y" : -1};
    }
};

Figure.prototype.pushIfPossible = function (xtmp, ytmp, positions){
    if(myBoard.isLegalField(xtmp, ytmp)){
        if (!myBoard.isPotentiallyWalkable(xtmp, ytmp, this.color)) {
            return false;
        }
        positions.push({"x": xtmp, "y": ytmp});
        if(myBoard.isEnemy(xtmp, ytmp, this.color)){
            return false;
        }
    }
    return true;
}

Figure.prototype.addPossibleYandXaxisMoves = function (positions, length){
    var xtmp = 0;
    var ytmp = 0;

    for(var i = 1; i < length; i++){

        xtmp = this.x + i;
        if(!this.pushIfPossible(xtmp, this.y, positions)){
            break;
        }
    }
    for(i = 1; i < length; i++){

        xtmp = this.x - i;
        if(!this.pushIfPossible(xtmp, this.y, positions)){
            break;
        }
    }
    for(i = 1; i < length; i++){

        ytmp = this.y + i;
        if(!this.pushIfPossible(this.x, ytmp, positions)){
            break;
        }
    }
    for(i = 1; i < length; i++){

        ytmp = this.y - i;
        if(!this.pushIfPossible(this.x, ytmp, positions)){
            break;
        }
    }
}

Figure.prototype.addPossibleDiagonalMoves = function (positions, length){
    var xtmp = 0;
    var ytmp = 0;

    for (var i = 1; i < length; i++) {
        
        xtmp = this.x + i;
        ytmp = this.y + i;
        if (!this.pushIfPossible(xtmp, ytmp, positions)){
            break;
        }
    }
    for (i = 1; i < length; i++){

        xtmp = this.x - i;
        ytmp = this.y - i;
        if (!this.pushIfPossible(xtmp, ytmp, positions)){
            break;
        }
    }
    for (i = 1; i < length; i++) {

        xtmp = this.x + i;
        ytmp = this.y - i;
        if (!this.pushIfPossible(xtmp, ytmp, positions)){
            break;
        }
    }
    for (i = 1; i < length; i++) {

        xtmp = this.x - i;
        ytmp = this.y + i;
        if (!this.pushIfPossible(xtmp, ytmp, positions)){
            break;
        }
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
                console.log("enemys enPassant:" + myBoard.getFigureAtPos(left.x, left.y).enPassant);
                if(myBoard.getFigureAtPos(left.x, left.y).enPassant){
                    positions.push(leftFront);
                }
            }
            if(myBoard.isEnemy(right.x, right.y, this.color)){
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
            var positions = [];
            console.log("KNIGHT " +this.color + " x: "+posX+ " y: "+posY);

            this.pushIfPossible(this.x - 1, this.y - 2, positions);
            this.pushIfPossible(this.x + 1, this.y - 2, positions);
            this.pushIfPossible(this.x - 2, this.y - 1, positions);
            this.pushIfPossible(this.x + 2, this.y - 1, positions);
            this.pushIfPossible(this.x - 1, this.y + 2, positions);
            this.pushIfPossible(this.x + 1, this.y + 2, positions);
            this.pushIfPossible(this.x - 2, this.y + 1, positions);
            this.pushIfPossible(this.x + 2, this.y + 1, positions);

            return positions;
        },
        id: 1,
        name: 'Knight'
    },
    BISHOP: {
		possibleMoves: function(myBoard) {
            console.log("BISHOP");

            var positions = [];

            this.addPossibleDiagonalMoves(positions, myBoard.board.length);

            return positions;
        },
        id: 2,
        name: 'Bishop'
    },
    QUEEN: {
        possibleMoves: function(myBoard) {
            console.log("QUEEN");
            var positions = [];

            this.addPossibleDiagonalMoves(positions, myBoard.board.length);
            this.addPossibleYandXaxisMoves(positions, myBoard.board.length);

            return positions;

        },
        id: 3,
        name: 'Queen'
    },
    KING: {
        possibleMoves: function(myBoard) {
            console.log("KING");
            var positions = [];

            this.addPossibleDiagonalMoves(positions, 2);
            this.addPossibleYandXaxisMoves(positions, 2);

            return positions;

        },
        id: 4,
        name: 'King'
    },
    ROOK: {
        possibleMoves: function(myBoard) {
            console.log("ROOK");

            var positions = [];

            this.addPossibleYandXaxisMoves(positions, myBoard.board.length);

            return positions;
        },
        id: 5,
        name: 'Rook'
    }
};