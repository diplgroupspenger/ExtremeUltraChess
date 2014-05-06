function convertPawn(figureId, pos) {
	lockFigures = true;
	var queen = new Figure(FigureType.QUEEN, player);
	var rook = new Figure(FigureType.ROOK, player);
	var bishop = new Figure(FigureType.BISHOP, player);
	var knight = new Figure(FigureType.KNIGHT, player);
	drawConvertion(queen, pos.x, pos.y, figureId);
	drawConvertion(rook, pos.x + 1, pos.y, figureId);
	drawConvertion(bishop, pos.x, pos.y + 1, figureId);
	drawConvertion(knight, pos.x - 1, pos.y, figureId);
}

function drawConvertion(figure, posX, posY, figureId) {
	var figurePos = getFigureFromSpritesheet(figure);
	var figureImage = new Kinetic.Image({
        x: posX * TILE_SIZE,
        y: posY * TILE_SIZE,
        image: pieces,
        opacity: 0.5,
        width: TILE_SIZE,
        height: TILE_SIZE,
        crop: {x: figurePos.x, y: figurePos.y, width: 50, height: 50}
    });
    
    rotateFigure(figureImage);

    figureImage.on('mouseover', function() {
        this.setOpacity(1);
        foreGroundLayer.draw();
    });

	figureImage.on('mouseout', function() {
		this.setOpacity(0.5);
		foreGroundLayer.draw();
	});

	figureImage.on('click', function() {
		lockFigures = false;
		var x = figureList[figureId].figure.x;
		var y = figureList[figureId].figure.y;

		//remove old figure and replayce with new
		figureList[figureId].remove();

		myBoard.board[y][x] = figure;
		myBoard.board[y][x].setPosition(x, y, myBoard);
		drawFigure(x, y, player);
		figureLayer.draw();
    	
    	foreGroundLayer.removeChildren();
    	foreGroundLayer.draw();
    	socket.emit('convertPawn', figure, x, y);
    	setNextTurn();
	});
    
    foreGroundLayer.add(figureImage);
}

function redrawConvertion() {
	_.each(foreGroundLayer.getChildren(), function(img) {
		//get old tilesize(width and height are equal)
		oldTileSize = img.getWidth(); 
		img.setX((img.getX() / oldTileSize) * TILE_SIZE);
		img.setY((img.getY() / oldTileSize) * TILE_SIZE);
		img.setWidth(TILE_SIZE);
		img.setHeight(TILE_SIZE);
	});
	foreGroundLayer.draw();
}

function rotateFigure(img) {
	if(player == Color.BLACK) {
		console.log("rotateblack");
		img.rotateDeg(180);
		img.setOffset(img.getHeight(), img.getWidth());
	}
	else if(player == Color.RED) {
		console.log("rotatered");
		img.rotateDeg(90);
		img.setOffset(0, img.getWidth());
	}
	else if(player == Color.GREEN) {
		console.log("rotategreen");
		img.rotateDeg(-90);
		img.setOffset(img.getHeight(), 0);
	}
}