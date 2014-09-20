angular.module('the-map').controller('Lab2Ctrl', function ($scope, $http, LineService, LapService) {
  'use strict';

  /*global X2JS */
  var x2js = new X2JS(); 

  $http.get('http://localhost:9001/test-data/kungsholmen_runt_2012/2012-05-05 11-30-14.gpx')
    .then(function(response) {
      
      var data = x2js.xml_str2json(response.data);

      console.log(data);


        var laps = data.gpx.trk.trkseg.map(function(trkseg) {
          return { points: trkseg.trkpt.map(function(trkpt) {
            return { latitude: parseFloat(trkpt._lat), longitude: parseFloat(trkpt._lon), timestamp: Date.parse(trkpt.time) };
            })
          };
        });

      console.log('laps', laps);

      var lines = LineService.getLinesFromLaps(laps);

      var center = LapService.getCenter(laps);

      console.log('lines', lines);

      $scope.kungsholmenMap = {
          center: {
              latitude: center.latitude,
              longitude: center.longitude
          },
          zoom: 14,
          lines: lines,
          ready: true,
          distance: LineService.getTotalDistanceAsK(laps),
          time: LineService.getTotalTimeAsMinutes(laps),
          averageTempo: LineService.getAverageTempo(laps)
      };


    });

  

});