var FigureType = {
    'PAWN': {
        possibleMoves: function(myBoard) {
            var posX = this.x;
            var posY = this.y;
            var positions = [];

            var inFront = {x: posX + this.inFront().x, y: posY + this.inFront().y};
            var inFront2 = {x: inFront.x + this.inFront().x, y: inFront.y + this.inFront().y};

            //nothing infront
            if(myBoard.isLegalTile(inFront.x, inFront.y)) {
                if(myBoard.board[inFront.y][inFront.x] === -1){
                    positions.push(inFront);

                    //check if the double-move is available
                    if(!this.hasMoved){
                        if(myBoard.board[inFront2.y][inFront2.x] === -1)
                            positions.push(inFront2);
                    }
                }
            }
            var leftFront =  {x: inFront.x + this.left().x, y: inFront.y + this.left().y};
            var rightFront = {x: inFront.x + this.right().x, y: inFront.y + this.right().y};

            //check for enemies in attack range
            if(myBoard.isEnemy(leftFront.x, leftFront.y, this.color)){
                positions.push(leftFront);
            }
            if(myBoard.isEnemy(rightFront.x, rightFront.y, this.color)){
                positions.push(rightFront);
            }

            var left = {x: posX + this.left().x, y: posY + this.left().y};
            var right = {x: posX + this.right().x, y: posY + this.right().y};

            //check for en passant
            if(myBoard.isEnemy(left.x, left.y, this.color)){
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
        name: 'PAWN'
    },
    'KNIGHT': {
        possibleMoves: function(myBoard) {
            var positions = [];

            this.pushIfPossible(this.x - 1, this.y - 2, positions, myBoard);
            this.pushIfPossible(this.x + 1, this.y - 2, positions, myBoard);
            this.pushIfPossible(this.x - 2, this.y - 1, positions, myBoard);
            this.pushIfPossible(this.x + 2, this.y - 1, positions, myBoard);
            this.pushIfPossible(this.x - 1, this.y + 2, positions, myBoard);
            this.pushIfPossible(this.x + 1, this.y + 2, positions, myBoard);
            this.pushIfPossible(this.x - 2, this.y + 1, positions, myBoard);
            this.pushIfPossible(this.x + 2, this.y + 1, positions, myBoard);

            return positions;
        },
        id: 1,
        name: 'KNIGHT'
    },
    'BISHOP': {
        possibleMoves: function(myBoard) {
            var positions = [];

            this.addPossibleDiagonalMoves(positions, myBoard.board.length, myBoard);

            return positions;
        },
        id: 2,
        name: 'BISHOP'
    },
    'QUEEN': {
        possibleMoves: function(myBoard) {
            var positions = [];

            this.addPossibleDiagonalMoves(positions, myBoard.board.length, myBoard);
            this.addPossibleYandXaxisMoves(positions, myBoard.board.length, myBoard);

            return positions;
        },
        id: 3,
        name: 'QUEEN'
    },
    'KING': {
        possibleMoves: function(myBoard) {
            var positions = [];

            this.addB0ssMoves(positions, myBoard);

            return positions;
        },
        id: 4,
        name: 'KING'
    },
    'ROOK': {
        possibleMoves: function(myBoard) {
            var positions = [];

            this.addPossibleYandXaxisMoves(positions, myBoard.board.length, myBoard);

            return positions;
        },
        id: 5,
        name: 'ROOK'
    }
};

if(typeof module !== 'undefined' && module.exports) {
    module.exports = FigureType;
}
