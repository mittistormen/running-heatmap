describe('LabCtrl', function () {

  var scope, ctrl;

  beforeEach(function () {
    module('the-map');
    inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('LabCtrl', {$scope: scope});
    });
  });

  xit('should have tests', function () {
    
  });

});