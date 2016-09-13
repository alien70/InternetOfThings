//  Thermostat

var mqtt = require('mqtt');
var cron = require('cron');

// unique identifier of the device
var uid = '33f58d9d-9b78-4a95-b858-7524d089b520';

var onlineTopic = uid + '/thermostat/online';
var readingTopic = uid + 'thermostat/reading';
var temperatureSetpointTopic = uid + 'thermostat/temperatureSetpoint';

var setPoint = 25;
var currentRead = {
    uid: uid,
    temperature: getRandomValue(setPoint - 1, setPoint + 1),
    humidity: getRandomValue(40, 60),
    timestamp: Date.now()
};

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

    var currentRead = {
        uid: uid,
        temperature: getRandomValue(setPoint - 1, setPoint + 1),
        humidity: getRandomValue(40, 60),
        timestamp: Date.now()
    };
    console.log('Current reading: Temperature = %s° - Humidity = %s% - Timestamp', currentRead.temperature.toFixed(2), currentRead.humidity.toFixed(2), currentRead.timestamp);
    client.publish(readingTopic, JSON.stringify(currentRead), {
        qos: 1
    });

}, null, true);

// Noise generator
function getRandomValue(min, max) {	
	return Math.random()*(max - min) + min;
}