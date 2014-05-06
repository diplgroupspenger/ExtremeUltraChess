function checkCmd(text) {
	var cmd = text.substr(0,text.indexOf(' '));

	if(cmd === ""){
		if(text == "turnoff"){
			turnoff();
		}

		if(text == "turnon"){
			turnon();
		}

		if(text == "dragall"){
			dragall();
		}

		if(text == "dragown"){
			dragown();
		}

		if(text == "possibleoff"){
			ignPossible = true;
			turnoff();
			$('#cmdText').text("Ignore possible moves");
			socket.emit('sendPossibleStatus', ignPossible);
			console.log("sendPossibleStatus");
		}

		if(text == "possibleon"){
			ignPossible = false;
			turnon();
			$('#cmdText').text("possible moves on");
			socket.emit('sendPossibleStatus', ignPossible);
			console.log("sendPossibleStatus");
		}

		if(text == "endgame"){
			terminateGame();
		}
	}
}

function turnoff(){
	turnOn = false;
			dragall();
			$('#cmdText').text("turnOff");
			socket.emit('sendTurnStatus', turnOn);
			console.log("sendturnstatus");
}

function turnon(){
	turnOn = true;
			dragown();
			$('#cmdText').text("turnOn");
			socket.emit('sendTurnStatus', turnOn);
			console.log("sendturnstatus");
}

function dragall() {
	for(i = 0; i < figureList.length; i++){
		figureList[i].setDraggable(true);
	}
	$('#cmdText').text("dragall");
}

function dragown() {
	for(i = 0; i < figureList.length; i++){
		if(figureList[i].figure.color != player){
			figureList[i].setDraggable(false);
		}
	}
	$('#cmdText').text("dragown");
}
