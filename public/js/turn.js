function Turn() {
	this.player = Color.WHITE;
};

Turn.prototype.nextTurn = function() {
	if(this.player != Color.GREEN) {
		this.player += 100;
	} 
	else {
		this.player = Color.WHITE;
	}
};

if(typeof module !== 'undefined' && module.exports) {
	var Color = require('./color.js');
	module.exports=Turn;
}