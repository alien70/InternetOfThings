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

      $scope.temperatureReading = _.chain(data)
        .map(function(o){
          return {
            x: Date.parse(o.timestamp) / 100,
            y: o.temperature
          };
        })
        .flatten()
        .value();

        console.log($scope.temperatureReading);    
    });
    
  });
