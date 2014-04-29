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

/*
Figure.prototype.isNormalPawnMove = function(posX, posY){
    if(this.type !== FigureType.PAWN) return false;

    var inFront = {x: this.x + this.inFront().x, y: this.y + this.inFront().y};
    var inFront2 = {x: inFront.x + this.inFront().x, y: inFront.y + this.inFront().y};
    if((inFront.x === posX && inFront.y === posY) ||
       (inFront2.x === posX && inFront2.y === posY)){
        return true;
    }
    else return false;
};
*/

Figure.prototype.inFront = function() {
    switch (this.color) {
        case Color.WHITE:
            return {
                x: 0,
                y: -1
            };
        case Color.BLACK:
            return {
                x: 0,
                y: 1
            };
        case Color.RED:
            return {
                x: 1,
                y: 0
            };
        case Color.GREEN:
            return {
                x: -1,
                y: 0
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
            x: xtmp,
            y: ytmp
        });
        if (myBoard.isEnemy(xtmp, ytmp, this.color)) {
            return false;
        }
    }
    return true;
};

Figure.prototype.addB0ssMoves = function(positions, myBoard){
    var tmpPositions = [];
    this.addPossibleDiagonalMoves(tmpPositions, 2, myBoard);
    this.addPossibleYandXaxisMoves(tmpPositions, 2, myBoard);

    var forbiddenMoves = this.forbiddenMoves(myBoard);

    var isPossible = true;
    for(var i = 0; i < tmpPositions.length; i++){
        for(var j = 0; j < forbiddenMoves.length; j++){
            if(tmpPositions[i].x === forbiddenMoves[j].x &&
               tmpPositions[i].y === forbiddenMoves[j].y){
                isPossible = false;
            }
        }
        if(isPossible){
            positions.push(tmpPositions[i]);
        }
        isPossible = true;
    }

};

Figure.prototype.getForbiddenB0ssIndexes = function(positions, virtualBoard){
    var forbiddenIndexes = [];

    for(var i = 0; i < virtualBoard.checkedTiles.length; i++){
        for(var j = 0; j < positions.length; j++){
            if(virtualBoard.checkedTiles[i].figure.color !== this.color &&
               positions[j].x === virtualBoard.checkedTiles[i].x &&
               positions[j].y === virtualBoard.checkedTiles[i].y){

                forbiddenIndexes.push(j);
            }
        }
    }
    return forbiddenIndexes;
};

Figure.prototype.forbiddenMoves = function(myBoard){
    var virtualBoard = myBoard;

    if(myBoard.isVirtual){
        virtualBoard = myBoard;
    }
    else{
        virtualBoard = myBoard.createVirtualBoard(this.x, this.y);
        virtualBoard.initCheckedTiles();
        console.log(myBoard);
        console.log(virtualBoard);
    }

    var positions = [];
    this.addPossibleDiagonalMoves(positions, 2, myBoard);
    this.addPossibleYandXaxisMoves(positions, 2, myBoard);

    var forbiddenMoves = [];
    var forbiddenIndexes = this.getForbiddenB0ssIndexes(positions, virtualBoard);
    for(var i = 0; i < forbiddenIndexes.length; i++){
        forbiddenMoves.push(positions[forbiddenIndexes[i]]);
    }
    return forbiddenMoves;
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
