function Turn() {
	this.player = {
		WHITE: {
			color: Color.WHITE,
			dead: false
		},
		RED: {
			color: Color.RED,
			dead: false
		},
		BLACK: {
			color: Color.BLACK,
			dead: false
		},
		GREEN: {
			color: Color.GREEN,
			dead: false
		}
	};

	this.curPlayer = this.player.WHITE;
};

Turn.prototype.nextTurn = function() {
	if(this.curPlayer.color != Color.GREEN) {
		for(var key in this.player) {
			if(this.player[key].color == this.curPlayer.color + 100) {
				var index = Object.keys(this.player).indexOf(key);
				this.curPlayer = this.player[key];
				break;
			}
		}
	} 
	else {
		this.curPlayer = this.player.WHITE;
	}

	if(this.curPlayer.dead)
		this.nextTurn();

};

Turn.prototype.remove = function(player) {
	for(var key in this.player) {
		if(this.player[key].color == player) {
			this.player[key].dead = true;
		}
	}
}

if(typeof module !== 'undefined' && module.exports) {
	var Color = require('./color.js');
	module.exports=Turn;
}