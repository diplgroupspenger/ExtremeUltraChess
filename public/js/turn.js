var Turn = function(cdCallback, turnCallback, importTurn) {
    if (importTurn === undefined) {
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
        this.turnLimit = 5;
        this.extraSeconds = false;
    } else {
        this.importTurn(importTurn);
    }

    this.extraSecondsLimit = 6;
    this.cdCallback = cdCallback;
    this.turnCallback = turnCallback;
    this.startCountdown();
};

Turn.prototype.importTurn = function(importTurn) {
    this.player = importTurn.player;
    this.curPlayer = importTurn.curPlayer;
    this.turnLimit = importTurn.turnLimit;
    this.curSeconds = importTurn.curSeconds;
    this.extraSeconds = importTurn.extraSeconds;
};

Turn.prototype.exportTurn = function() {
    return {
        'player': this.player,
        'curPlayer': this.curPlayer,
        'turnLimit': this.turnLimit,
        'curSeconds': this.curSeconds,
        'extraSeconds': this.extraSeconds
    }
};

Turn.prototype.nextTurn = function() {
    if (this.curPlayer.color != Color.GREEN) {
        for (var key in this.player) {
            if (this.player[key].color == this.curPlayer.color + 100) {
                var index = Object.keys(this.player).indexOf(key);
                this.curPlayer = this.player[key];
                break;
            }
        }
    } else {
        this.curPlayer = this.player.WHITE;
    }

    if (this.curPlayer.dead)
        this.nextTurn();

    this.curSeconds = this.turnLimit;
    this.extraSeconds = false;
    if (this.turnCallback !== undefined) {
        this.turnCallback();
    }
};

Turn.prototype.remove = function(player) {
    for (var key in this.player) {
        if (this.player[key].color == player) {
            this.player[key].dead = true;
        }
    }
};

Turn.prototype.startCountdown = function() {
    this.curSeconds = this.turnLimit;
    this.counter = setInterval(this.countdown.bind(this), 1000);
};

Turn.prototype.countdown = function() {
    if(this.getDeadPlayer() >= 3){
        clearInterval(this.counter);
    } else {
        this.curSeconds = this.curSeconds - 1;
        if (this.curSeconds < 0) {
            if(this.extraSeconds === false) {
                this.curSeconds = this.extraSecondsLimit;
                this.extraSeconds = true;
            }
            else {
                this.remove(this.curPlayer.color);
                //extra seconds are over
                this.extraSeconds = false;
                this.nextTurn();
            }
        }
        if (this.cdCallback !== undefined) {
            this.cdCallback();
        }
    }
};

Turn.prototype.getDeadPlayer = function() {
    var deadPlayer = 0;

    if(this.player.WHITE.dead) 
        deadPlayer++;
    if(this.player.RED.dead)
        deadPlayer++;
    if(this.player.BLACK.dead)
        deadPlayer++;
    if(this.player.GREEN.dead)
        deadPlayer++;

    return deadPlayer;
};

Turn.prototype.getWinner = function() {
    if(!this.player.WHITE.dead)
        return Color.WHITE;
    else if(!this.player.RED.dead)
        return Color.RED;
    else if(!this.player.BLACK.dead)
        return Color.BLACK;
    else if(!this.player.GREEN.dead)
        return Color.GREEN;
}

Turn.prototype.terminate = function() {
    clearInterval(this.counter);
};

if (typeof module !== 'undefined' && module.exports) {
    var Color = require('./color.js');
    module.exports = Turn;
}