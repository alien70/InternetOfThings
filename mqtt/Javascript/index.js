var mqtt = require('mqtt');

// unique identifier of the device
var uid = '33f58d9d-9b78-4a95-b858-7524d089b520';

var onlineTopic = uid + '/thermostat/online';

var client = mqtt.connect('mqtt://broker.hivemq.com', {
    will:{
        topic: onlineTopic,
        payload: 'false'
    }
});

client.on('connect', () => {
	client.publish(onlineTopic, 'true', {
        qos: 1,
        retain: true
    });
    console.log('%s true', onlineTopic);
})