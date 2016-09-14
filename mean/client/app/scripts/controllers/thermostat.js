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
    var data = Thermostat.getList().$object;
    $scope.thermostats = data;

    $scope.renderer = 'line';

    $scope.temperatureReading =  
    
    [
      {
        x: 0,
        y: 0
      },
      {
        x: 1,
        y: 1
      },
      {
        x: 2,
        y: 2
      },
      {
        x: 3,
        y: 3
      },
      {
        x: 4,
        y: 4
      },
      {
        x: 5,
        y: 5
      }
      
    ];
  });
