'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ThermostatCtrl
 * @description
 * # ThermostatCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ThermostatCtrl', function ($scope) {
    
    // live mqtt data reading
    var client = new Paho.MQTT.Client('broker.mqttdashboard.com', 8000, 'test');

    var connected = false;
    var setPoint = 0.0;
    $scope.currentRead = null;

    var uid = '33f58d9d-9b78-4a95-b858-7524d089b520';
    var onlineTopic = uid + '/thermostat/online';
    var readingTopic = uid + 'thermostat/reading';
    var temperatureSetpointTopic = uid + 'thermostat/temperatureSetpoint';

    $scope.connected = false;
    $scope.thermostat_state = 'offline';
    
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    client.connect({onSuccess:onConnect});

    function onConnect() {
        client.subscribe(onlineTopic);
        client.subscribe(readingTopic);
        client.subscribe(temperatureSetpointTopic);

        console.log("onConnect");
    }

    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
          console.log("onConnectionLost:"+responseObject.errorMessage);
        }
    }    

    // called when a message arrives
    function onMessageArrived(message) {
      var topic = message.destinationName;
      var payload = message.payloadString;
      switch(topic) {
        case onlineTopic: {
          $scope.connected = (payload.toString() === 'true');	
          
          $scope.thermostat_state = ($scope.connected !== true) ? 'offline' : 'online';
          
          $scope.$apply();
          console.log('Thermostat %s', ($scope.connected) ? 'online' : 'offline' );		
        } break;

        case readingTopic: {
            
            $scope.currentRead = JSON.parse(payload);
            $scope.thermostat_state = ($scope.connected !== true) ? 'offline' : 'online';

            console.log('Current reading: Temperature = %s° - Humidity = %s% - Timestamp', $scope.currentRead.temperature.toFixed(2), $scope.currentRead.humidity.toFixed(2), $scope.currentRead.timestamp);

            $scope.$apply();
        } break;
      }
    }    
    
  });
