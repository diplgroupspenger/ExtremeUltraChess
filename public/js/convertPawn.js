function convertPawn(figureId, pos) {
	lockFigures = true;
	var queen = new Figure(FigureType.QUEEN, player);
	var rook = new Figure(FigureType.ROOK, player);
	var bishop = new Figure(FigureType.BISHOP, player);
	var knight = new Figure(FigureType.KNIGHT, player);
	draw(queen, pos.x, pos.y - 1, figureId);
	draw(rook, pos.x + 1, pos.y, figureId);
	draw(bishop, pos.x, pos.y + 1, figureId);
	draw(knight, pos.x - 1, pos.y, figureId);
}

function draw(figure, posX, posY, figureId) {
	var figurePos = getFigureFromSpritesheet(figure);
	var figureImage = new Kinetic.Image({
        x: posX * TILE_SIZE,
        y: posY * TILE_SIZE,
        image: pieces,
        opacity: 0.5,
        width: TILE_SIZE,
        height: TILE_SIZE,
        crop: {x: figurePos.x,y: figurePos.y,width: TILE_SIZE,height: TILE_SIZE}
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

function rotateFigure(img) {
	if(player == Color.BLACK) {
		img.rotateDeg(180);
		img.setOffset(img.getHeight(), img.getWidth());
	}
	else if(player == Color.RED) {
		img.rotateDeg(90);
		img.setOffset(0, img.getWidth());
	}
	else if(player == Color.GREEN) {
		img.rotateDeg(-90);
		img.setOffset(img.getHeight(), 0);
	}
}