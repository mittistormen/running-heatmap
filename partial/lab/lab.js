angular.module('the-map').controller('LabCtrl', function ($scope, $http, LapService, CalculationService) {
  'use strict';
  /*global X2JS */
  var x2js = new X2JS(); 

  $scope.map = {
    showTrack: false
  };

  $scope.kungsholmenMap = {
    ready: false
  };


  var shopMap = function(laps) {

    var center = LapService.getCenter(laps);
    var points = LapService.getAllPoints(laps);

    $scope.map = {
        center: {
            latitude: center.latitude,
            longitude: center.longitude
        },
        zoom: 14,
        laps: laps,
        showTrack: true,
        distance: CalculationService.getTotalDistanceAsK(points),
        time: CalculationService.getTotalTimeAsMinutes(points),
        averageTempo: CalculationService.getAverageTempo(points)
    };
  };

  $http.get('http://localhost:9001/test-data/test2.xml')
    .then(function(response) {
      
      var data = x2js.xml_str2json(response.data);

      console.log(data);


        var laps = data.gpx.trk.trkseg.map(function(trkseg) {
          return { points: trkseg.trkpt.map(function(trkpt) {
            return { latitude: parseFloat(trkpt._lat), longitude: parseFloat(trkpt._lon), timestamp: Date.parse(trkpt.time) };
            })
          };
        });

        shopMap(laps);


    });

});