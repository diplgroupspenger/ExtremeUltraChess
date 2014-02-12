function checkCmd(text) {
	var cmd = text.substr(0,text.indexOf(' '));
	if(cmd == "turnoff"){
		turnOn = false;
		socket.emit('sendTurnStatus', turnOn);
	}

	if(cmd == "turnon"){
		turnOn = true;
		socket.emit('sendTurnStatus', turnOn);
	}
}