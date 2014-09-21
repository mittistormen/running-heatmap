angular.module('the-map').controller('LabCtrl', function ($scope, $http, GpxReader, CalculationService) {
  'use strict';

  $scope.map = {
    showTrack: false
  };

  GpxReader.getTrackFromFile('http://localhost:9001/test-data/test2.xml', function(track) {

    $scope.map = {
        center: {
            latitude: track.center.latitude,
            longitude: track.center.longitude
        },
        zoom: 14,
        points: track.points,
        showTrack: true,
        distance: CalculationService.getTotalDistanceAsK(track.points),
        time: CalculationService.getTotalTimeAsMinutes(track.points),
        averageTempo: CalculationService.getAverageTempo(track.points)
    };
    
  });


});