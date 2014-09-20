angular.module('the-map').controller('Lab2Ctrl', function ($scope) {
  'use strict';

  $scope.map = {
      center: {
          latitude: 44.140732000,
          longitude: 9.633704000
      },
      zoom: 15
  };

  $scope.laps = [];
  $scope.showTrack = false;

  

});