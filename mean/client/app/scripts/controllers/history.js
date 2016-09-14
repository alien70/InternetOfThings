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
    $scope.thermostats = Thermostat.getList().$object;
  });
