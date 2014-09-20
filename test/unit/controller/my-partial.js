describe('MyPartialCtrl', function () {

  var scope, ctrl;

  beforeEach(function () {
    module('the-map');
    inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('MyPartialCtrl', {$scope: scope});
    });
  });

  xit('should have tests', function () {
    
  });

});