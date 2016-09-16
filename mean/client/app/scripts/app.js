'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngRoute',
    'restangular'
  ])
  .config(function ($routeProvider, RestangularProvider) {
    
    RestangularProvider.setBaseUrl('http://localhost:3000');

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
      })
      .when('/history', {
        templateUrl: 'views/history.html',
        controller: 'HistoryCtrl',
      })
      .when('/history/charts', {
        templateUrl: 'views/charts.html',
        controller: 'ChartsCtrl',
      })
      .when('/thermostat', {
        templateUrl: 'views/thermostat.html',
        controller: 'ThermostatCtrl',
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('ThermostatRestangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setRestangularFields({
        id: '_id'
      });
    });
  })
  .factory('Thermostat', function(ThermostatRestangular) {
    return ThermostatRestangular.service('thermostat');
  });
