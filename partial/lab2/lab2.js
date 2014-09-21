angular.module('the-map').controller('Lab2Ctrl', function ($scope, $http, LineService, GpxReader, CalculationService) {
  'use strict';

  GpxReader.getTrackFromFile('http://localhost:9001/test-data/kungsholmen_runt_2012/2012-05-05 11-30-14.gpx', function(track) {

    var lines = LineService.convertToLines(track.points);

    $scope.kungsholmenMap = {
        center: {
            latitude: track.center.latitude,
            longitude: track.center.longitude
        },
        zoom: 14,
        lines: lines,
        ready: true,
        distance: CalculationService.getTotalDistanceAsK(track.points),
        time: CalculationService.getTotalTimeAsMinutes(track.points),
        averageTempo: CalculationService.getAverageTempo(track.points)
    };

  });

});