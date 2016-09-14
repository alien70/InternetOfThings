'use strict';

describe('Controller: ThermostatCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ThermostatCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ThermostatCtrl = $controller('ThermostatCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ThermostatCtrl.awesomeThings.length).toBe(3);
  });
});
