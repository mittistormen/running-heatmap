describe('Lab3Ctrl', function () {

  var scope, ctrl;

  beforeEach(function () {
    module('the-map');
    inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('Lab3Ctrl', {$scope: scope});
    });
  });

  xit('should have tests', function () {
    
  });

});