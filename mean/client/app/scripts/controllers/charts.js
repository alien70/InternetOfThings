'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ChartsCtrl
 * @description
 * # ChartsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ChartsCtrl', function ($scope, Thermostat) {
        $scope.viewChart = true;
        $scope.viewTable = false;

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
        });

  });
