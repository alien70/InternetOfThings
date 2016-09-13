// Remote
var mqtt = require('mqtt');
var request = require('request');
var client = mqtt.connect('mqtt://broker.hivemq.com');

// REST Api url
var url = 'http://localhost:3000/thermostat';

var connected = false;
var setPoint = 0.0;
var currentRead = null;

// unique identifier of the device
var uid = '33f58d9d-9b78-4a95-b858-7524d089b520';
var onlineTopic = uid + '/thermostat/online';
var readingTopic = uid + 'thermostat/reading';
var temperatureSetpointTopic = uid + 'thermostat/temperatureSetpoint';

client.on('connect', () => {
	client.subscribe(onlineTopic);
	client.subscribe(readingTopic);	
	client.subscribe(temperatureSetpointTopic);
})

client.on('message', (topic, message) => {
	switch(topic){
		case onlineTopic: {
			connected = (message.toString() === 'true');	
			console.log('Thermostat is %s', (connected) ? 'online' : 'offline' );		
		} break;

		case readingTopic: {
				currentRead = JSON.parse(message);
				console.log('Current reading: Temperature = %s° - Humidity = %s% - Timestamp', currentRead.temperature.toFixed(2), currentRead.humidity.toFixed(2), currentRead.timestamp);

				// Serialize current reading on MongoDB via REST Api
				request({
					url: url,
					method: 'POST',
					json: currentRead
				}, function(error, response, body){
					if(error){
						console.log(error);
					} else {
						console.log(response.statusCode, body);
					}
				});								
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