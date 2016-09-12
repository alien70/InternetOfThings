//  Thermostat

var mqtt = require('mqtt');
var cron = require('cron');

// unique identifier of the device
var uid = '33f58d9d-9b78-4a95-b858-7524d089b520';

var onlineTopic = uid + '/thermostat/online';
var temperatureTopic = uid + 'thermostat/temp';
var humidityTopic = uid + 'thermostat/humidity';
var temperatureSetpointTopic = uid + 'thermostat/temperatureSetpoint';

var setPoint = 25;
var currTemp = getRandomValue(setPoint - 1, setPoint + 1);
var currHumidity = getRandomValue(40, 60);

var client = mqtt.connect('mqtt://broker.hivemq.com', {
    will:{
        topic: onlineTopic,
        payload: 'false',
        qos: 1,
        retain: true
    }
});

client.on('connect', () => {
	client.publish(onlineTopic, 'true', {
        qos: 1,
        retain: true
    });

    console.log('%s true', onlineTopic);

	client.publish(temperatureSetpointTopic, JSON.stringify( setPoint ), {
        qos: 1,
        retain: true
    });

	console.log('Set point %s', setPoint.toFixed(2));
});

// Periodic task (triggers every minute)
var job = new cron.CronJob('* * * * *', function() {  

	currTemp = getRandomValue(setPoint - 1, setPoint + 1);
    client.publish(temperatureTopic, JSON.stringify(currTemp), {
    	qos: 1
    });

	console.log('Temperature: %s° @ ', currTemp.value.toFixed(2) , currTemp.timestamp);

	var currHumidity = getRandomValue(40, 60);
    client.publish(humidityTopic, JSON.stringify(currHumidity), {
    	qos: 1
    });

    console.log('Humidity: %s% @ ', currHumidity.value.toFixed(2) , currHumidity.timestamp);

}, null, true);

// Noise generator
function getRandomValue(min, max) {	
	return { value: (Math.random()*(max - min)) + min, timestamp: Date.now() };
}