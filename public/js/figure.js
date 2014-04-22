var Figure = function(type, color, importFigure) {
    //if no figure to import is passed call normal constructor
    if (importFigure === undefined) {
        this.type = type;
        this.color = color;
        this.x = 0;
        this.y = 0;
        this.hasMoved = false;
        this.enPassant = false;
    } else
        this.importFigure(importFigure);
};

Figure.prototype.importFigure = function(importFigure) {
    this.type = FigureType[importFigure.name];
    this.color = importFigure.color;
    this.x = importFigure.x;
    this.y = importFigure.y;
    this.hasMoved = importFigure.hasMoved;
    this.enPassant = importFigure.enPassant;
};

Figure.prototype.exportFigure = function() {
    return {
        'name': this.type.name,
        'color': this.color,
        'x': this.x,
        'y': this.y,
        'hasMoved': this.hasMoved,
        'enPassant': this.enPassant
    };
};

Figure.prototype.possibleMoves = function(myBoard) {
    return this.type.possibleMoves.call(this, myBoard);
};

Figure.prototype.setPosition = function(newX, newY, myBoard) {
    for (var y = 0; y < myBoard.board[0].length; y++) {
        for (var x = 0; x < myBoard.board.length; x++) {
            if (myBoard.isFigure(x, y)) {
                myBoard.board[y][x].enPassant = false;
            }
        }
    }
    if (this.type == FigureType.PAWN && ((this.x + 2 * this.inFront().x === newX && this.inFront().x !== 0) ||
        (this.y + 2 * this.inFront().y === newY && this.inFront().y !== 0))) {
        this.enPassant = true;
    }
    this.x = newX;
    this.y = newY;
    this.hasMoved = true;
};

Figure.prototype.setPositionRelentless = function(x, y) {
    this.x = x;
    this.y = y;
};

Figure.prototype.inFront = function() {
    switch (this.color) {
        case Color.WHITE:
            return {
                "x": 0,
                "y": -1
            };
        case Color.BLACK:
            return {
                "x": 0,
                "y": 1
            };
        case Color.RED:
            return {
                "x": 1,
                "y": 0
            };
        case Color.GREEN:
            return {
                "x": -1,
                "y": 0
            };
    }
};

Figure.prototype.behind = function() {
    switch (this.color) {
        case Color.WHITE:
            return {
                "x": 0,
                "y": 1
            };
        case Color.BLACK:
            return {
                "x": 0,
                "y": -1
            };
        case Color.RED:
            return {
                "x": -1,
                "y": 0
            };
        case Color.GREEN:
            return {
                "x": 1,
                "y": 0
            };
    }
};

Figure.prototype.left = function() {
    switch (this.color) {
        case Color.WHITE:
            return {
                "x": -1,
                "y": 0
            };
        case Color.BLACK:
            return {
                "x": 1,
                "y": 0
            };
        case Color.RED:
            return {
                "x": 0,
                "y": -1
            };
        case Color.GREEN:
            return {
                "x": 0,
                "y": 1
            };
    }
};

Figure.prototype.right = function() {
    switch (this.color) {
        case Color.WHITE:
            return {
                "x": 1,
                "y": 0
            };
        case Color.BLACK:
            return {
                "x": -1,
                "y": 0
            };
        case Color.RED:
            return {
                "x": 0,
                "y": 1
            };
        case Color.GREEN:
            return {
                "x": 0,
                "y": -1
            };
    }
};

Figure.prototype.pushIfPossible = function(xtmp, ytmp, positions, myBoard) {
    if (myBoard.isLegalTile(xtmp, ytmp)) {
        if (!myBoard.isPotentiallyWalkable(xtmp, ytmp, this.color)) {
            return false;
        }
        positions.push({
            "x": xtmp,
            "y": ytmp
        });
        if (myBoard.isEnemy(xtmp, ytmp, this.color)) {
            return false;
        }
    }
    return true;
};

Figure.prototype.addB0ssMoves = function(positions, myBoard){
    this.addPossibleDiagonalMoves(positions, 2, myBoard);
    this.addPossibleYandXaxisMoves(positions, 2, myBoard);

    for(var i = 0; i < myBoard.checkedTiles.length; i++){
        for(var j = 0; j < positions.length; j++){
            if(myBoard.checkedTiles[i].figure.color !== this.color && positions[j].x === myBoard.checkedTiles[i].x &&
               positions[j].y === myBoard.checkedTiles[i].y){
                positions.splice(j, 1);
            }
        }
    }
};

Figure.prototype.addPossibleYandXaxisMoves = function(positions, length, myBoard) {
    var xtmp = 0;
    var ytmp = 0;

    for (var i = 1; i < length; i++) {
        xtmp = this.x + i;
        if (!this.pushIfPossible(xtmp, this.y, positions, myBoard))
            break;
    }
    for (i = 1; i < length; i++) {
        xtmp = this.x - i;
        if (!this.pushIfPossible(xtmp, this.y, positions, myBoard))
            break;
    }
    for (i = 1; i < length; i++) {
        ytmp = this.y + i;
        if (!this.pushIfPossible(this.x, ytmp, positions, myBoard))
            break;
    }
    for (i = 1; i < length; i++) {
        ytmp = this.y - i;
        if (!this.pushIfPossible(this.x, ytmp, positions, myBoard))
            break;
    }
};

Figure.prototype.addPossibleDiagonalMoves = function(positions, length, myBoard) {
    var xtmp = 0;
    var ytmp = 0;

    for (var i = 1; i < length; i++) {
        xtmp = this.x + i;
        ytmp = this.y + i;
        if (!this.pushIfPossible(xtmp, ytmp, positions, myBoard))
            break;
    }
    for (i = 1; i < length; i++) {
        xtmp = this.x - i;
        ytmp = this.y - i;
        if (!this.pushIfPossible(xtmp, ytmp, positions, myBoard))
            break;
    }
    for (i = 1; i < length; i++) {
        xtmp = this.x + i;
        ytmp = this.y - i;
        if (!this.pushIfPossible(xtmp, ytmp, positions, myBoard))
            break;
    }
    for (i = 1; i < length; i++) {
        xtmp = this.x - i;
        ytmp = this.y + i;
        if (!this.pushIfPossible(xtmp, ytmp, positions, myBoard))
            break;
    }
};
//check for node
if (typeof module !== 'undefined' && module.exports) {
    var FigureType = require('./figureType.js');
    var Color = require('./color.js');
    module.exports = Figure;
}
