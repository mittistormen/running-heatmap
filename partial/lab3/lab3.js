angular.module('the-map').controller('Lab3Ctrl', function ($scope, GpxReader, CalculationService) {
  'use strict';

  var round = function(position) {
    return parseFloat(position).toFixed(3); //round positions to equalize the tracks
  };

  GpxReader.getTrackFromFile('http://localhost:9001/test-data/kungsholmen_runt_2012/2012-05-05 11-30-14.gpx', function(track1) {

    GpxReader.getTrackFromFile('http://localhost:9001/test-data/kungsholmen_runt_2012/2012-05-05 11-30-15.gpx', function(track2) {
      
      console.log('track1.points', track1.points.length);
      console.log('track2.points', track2.points.length);

      var commonPoints = [];
      track1.points.forEach(function(point1) {

        track2.points.forEach(function(point2) {
          if(round(point1.latitude) === round(point2.latitude) &&
            round(point1.longitude) === round(point2.longitude) &&  
            CalculationService.getDistanceBetweenTwoPointsInKm(point1.latitude, point1.longitude, point2.latitude, point2.longitude) < 0.01) //only pick points that is less than 10 m apart.
          {
            commonPoints.push(point1);
          }
        });
      });

      console.log('commonPoints', commonPoints.length);

      $scope.map = {
          center: { 
              latitude: track1.center.latitude,
              longitude: track1.center.longitude
          },
          zoom: 14,
          points: commonPoints,
          showTrack: true,
          distance: CalculationService.getTotalDistanceAsK(commonPoints),
          time: CalculationService.getTotalTimeAsMinutes(commonPoints),
          averageTempo: CalculationService.getAverageTempo(commonPoints)
      };
    
    });

  });

});