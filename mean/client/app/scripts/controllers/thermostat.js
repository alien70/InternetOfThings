'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ThermostatCtrl
 * @description
 * # ThermostatCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ThermostatCtrl', function ($scope, Thermostat) {
    Thermostat.getList().then(function(values){
      var data = values;

      $scope.thermostats = data;

      $scope.renderer = 'line';

      var temperatureReading = _.chain(data)
        .map(function(o){
          return {
            x: Date.parse(o.timestamp) / 1000,
            y: o.temperature
          };
        })
        .flatten()
        .value();

      var humidityReading = _.chain(data)
        .map(function(o){
          return {
            x: Date.parse(o.timestamp) / 1000,
            y: o.humidity
          };
        })
        .flatten()
        .value();

        $scope.thermostatReading = [ temperatureReading, humidityReading ];
        
        console.log($scope.thermostatReading);    
    });
    
  });
