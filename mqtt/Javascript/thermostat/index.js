//  Thermostat

var mqtt = require('mqtt');
var cron = require('cron');

// unique identifier of the device
var uid = '0x90-0xa2-0xda-0xe-0xa1-0x30';

var onlineTopic = uid + '/nido/online';
var readingTopic = uid + 'nido/reading';
var temperatureSetpointTopic = uid + 'nido/temperatureSetpoint';

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
