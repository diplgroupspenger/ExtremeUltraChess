function initRules() {

	var header1 = "#1 - Aufgehobenes Matt";
	var rule1 = "Falls ein Spieler aus dem Matt herauskommt, muss er als erstes auf Schachgebote reagieren. Falls ein solcher Spieler z. B. eine starke Figur des linken Gegners schlagen könnte, jedoch im Schach durch eine Figur des rechten Gegners steht, muss er zuerst auf das Schach reagieren, selbst wenn sein Partner dieses Schachgebot beseitigen könnte, bevor der rechte Spieler dran ist. Wenn ein Spieler während des Spiels aus dem Matt herauskommt, z. B. indem sein Partner dabei hilft, habenseine Figuren den Status 'aufgetaut'. Diese können dann erst geschlagen werden, nachdem der aufgetaute Spieler erstmals wieder gezogen hat. Ansonsten wäre es zu leicht, den Matt gesetzten Spieler rundenweise auszuschlachten, da er immer erst auf das Schach reagieren muss und seine angegriffenen Figuren nicht retten kann.";

	var header2 = "#2 - König schlagen?";
	var rule2 = "Es kann vorkommen, dass ein Spieler einen König schlagen kann, ohne dass der angegriffene Spieler vor seinem letzten Zug im Schach stand. Wenn z. B. der Nordspieler eine Figur bewegt, und dadurch ein Abzugsschach einer Figur des Südspielers auf den Westspieler freisetzt, dann ist der Südspieler dran, bevor der Westspieler auf das Schach reagieren muss. Das Schlagen des gegnerischen Königs macht dann nur in der Variante Sinn, in der die Figuren des damit, vom Prinzip her, Matt gesetzten Spielers vom Brett genommen oder zur eigenen Armee hinzugefügt werden. In der Variante, in der die Figuren einfrieren, ist König schlagen verboten. Solche Zeitpunkte lassen sich aber gut für einen Figurengewinn nutzen.";

	var $msg = $('<div id="rules">');
	$msg.append($('<div class="header">').text(header1));
	$msg.append($('<div class="rule">').text(rule1));
	$msg.append($('<div class="header">').text(header2));
	$msg.append($('<div class="rule">').text(rule2));
	console.log($msg);
	$('#rulesTab').empty();
	$('#rulesTab').append($msg);
}