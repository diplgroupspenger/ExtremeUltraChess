var Figure = function(type, color, importFigure){
  //if no figure to import is passed call normal constructor
  if(typeof importFigure === "undefined") {
    this.type = type;
    this.color = color;
    this.x;
    this.y;
    this.hasMoved = false;
    this.enPassant = false;
  }
  else
      this.importFigure(importFigure);
}

Figure.prototype.importFigure = function(importFigure){
  this.type = FigureType[importFigure.name];
  this.color = importFigure.color;
  this.x = importFigure.x;
  this.y = importFigure.y;
  this.hasMoved = importFigure.hasMoved;
  this.enPassant = importFigure.enPassant;
};

Figure.prototype.exportFigure = function(){
  return {'name': this.type.name,
          'color':this.color,
          'x':this.x,
          'y':this.y,
          'hasMoved':this.hasMoved,
          'enPassant':this.enPassant};
};

Figure.prototype.possibleMoves = function(board){
  return this.type.possibleMoves.call(this,board);
};

Figure.prototype.setPosition = function(x,y){
  for(var i = 0; i < figureList.length; i++){
    if(figureList[i].figure.color === this.color)
        figureList[i].figure.enPassant = false;
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

Figure.prototype.pushIfPossible = function(xtmp, ytmp, positions){
  if(myBoard.isLegalTile(xtmp, ytmp)){
    if (!myBoard.isPotentiallyWalkable(xtmp, ytmp, this.color)) {
        return false;
    }
    positions.push({"x": xtmp, "y": ytmp});
    if(myBoard.isEnemy(xtmp, ytmp, this.color)){
        return false;
    }
  }
  return true;
};

Figure.prototype.addPossibleYandXaxisMoves = function(positions, length){
    var xtmp = 0;
    var ytmp = 0;

    for(var i = 1; i < length; i++){
      xtmp = this.x + i;
      if(!this.pushIfPossible(xtmp, this.y, positions))
        break;
    }
    for(i = 1; i < length; i++){
      xtmp = this.x - i;
      if(!this.pushIfPossible(xtmp, this.y, positions))
        break;
    }
    for(i = 1; i < length; i++){
      ytmp = this.y + i;
      if(!this.pushIfPossible(this.x, ytmp, positions))
        break;
    }
    for(i = 1; i < length; i++){
      ytmp = this.y - i;
      if(!this.pushIfPossible(this.x, ytmp, positions))
        break;
    }
}

Figure.prototype.addPossibleDiagonalMoves = function(positions, length){
  var xtmp = 0;
  var ytmp = 0;

  for(var i = 1; i < length; i++){
    xtmp = this.x + i;
    ytmp = this.y + i;
    if(!this.pushIfPossible(xtmp, ytmp, positions))
      break;
  }
  for(i = 1; i < length; i++){
    xtmp = this.x - i;
    ytmp = this.y - i;
    if(!this.pushIfPossible(xtmp, ytmp, positions))
      break;  
  }
  for(i = 1; i < length; i++){
    xtmp = this.x + i;
    ytmp = this.y - i;
    if (!this.pushIfPossible(xtmp, ytmp, positions))
      break;
  }
  for(i = 1; i < length; i++){
    xtmp = this.x - i;
    ytmp = this.y + i;
    if (!this.pushIfPossible(xtmp, ytmp, positions))
      break;
  }
};
//check for node
if(typeof module !== 'undefined' && module.exports) {
  module.exports = Figure;
}