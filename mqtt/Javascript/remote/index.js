// Remote
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://broker.hivemq.com');

var connected = false;
var setPoint = 0.0;
var currTemp = null;
var currHumidity = null;

// unique identifier of the device
var uid = '33f58d9d-9b78-4a95-b858-7524d089b520';
var onlineTopic = uid + '/thermostat/online';
var temperatureTopic = uid + 'thermostat/temp';
var humidityTopic = uid + 'thermostat/humidity';
var temperatureSetpointTopic = uid + 'thermostat/temperatureSetpoint';

client.on('connect', () => {
	client.subscribe(onlineTopic);
	client.subscribe(temperatureTopic);
	client.subscribe(humidityTopic);
	client.subscribe(temperatureSetpointTopic);
})

client.on('message', (topic, message) => {
	switch(topic){
		case onlineTopic: {
			connected = (message.toString() === 'true');	
			console.log('Thermostat is %s', (connected) ? 'online' : 'offline' );		
		} break;

		case temperatureTopic: {
				currTemp = JSON.parse(message);
				console.log('Temperature: %s° @ ', currTemp.value.toFixed(2) , currTemp.timestamp);
		} break;

		case humidityTopic: {
				currHumidity = JSON.parse(message);
				console.log('Humidity: %s% @ ', currHumidity.value.toFixed(2) , currHumidity.timestamp);
		} break;

		case temperatureSetpointTopic: {
			setPoint = JSON.parse(message);
			console.log('Set point %s', setPoint.toFixed(2));
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