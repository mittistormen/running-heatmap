describe('Lab2Ctrl', function () {

  var scope, ctrl;

  beforeEach(function () {
    module('the-map');
    inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('Lab2Ctrl', {$scope: scope});
    });
  });

  xit('should have tests', function () {
    
  });

});