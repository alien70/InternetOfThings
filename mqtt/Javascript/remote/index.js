// Remote
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://broker.hivemq.com');

var connected = false;

// unique identifier of the device
var uid = '33f58d9d-9b78-4a95-b858-7524d089b520';
var onlineTopic = uid + '/thermostat/online';

client.on('connect', () => {
	client.subscribe(onlineTopic);
})

client.on('message', (topic, message) => {
	switch(topic){
		case onlineTopic: {
			connected = (message.toString() === 'true');	
			console.log('Thermostat is %s', (connected) ? 'online' : 'offline' );		
		} break;
	}
})

// User interface
var readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
	console.log(str);
	switch(str){
		case 'q': {
			process.exit();
		} break;
	}
})