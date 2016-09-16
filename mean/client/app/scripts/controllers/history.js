'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('HistoryCtrl', function ($scope, Thermostat) {
        $scope.viewTable = true;
        $scope.viewChart = false;
        Thermostat.getList().then(function(values){
          var data = values;
          $scope.thermostats = data;
        });
        
  });
