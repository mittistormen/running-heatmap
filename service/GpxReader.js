angular.module('the-map').service('GpxReader', function ($http) {
  'use strict';

  /*global X2JS */
  var x2js = new X2JS(); 

  var getAllPoints = function(laps) {
    var allPoints = [];
    allPoints = allPoints.concat.apply(allPoints, laps.map(function(lap) { return lap.points; }));
    return allPoints;
  };


  var getCenter = function(laps) {
    var middleLap = laps[Math.round(laps.length/2)];
    var point = middleLap.points[0];
    return point;
  };

  var getTrackFromFile = function(file, done) {

    $http.get(file)
      .then(function(response) {
        
        var data = x2js.xml_str2json(response.data);

        console.log(data);

        var laps = data.gpx.trk.trkseg.map(function(trkseg) {
          return { points: trkseg.trkpt.map(function(trkpt) {
            return { latitude: parseFloat(trkpt._lat), longitude: parseFloat(trkpt._lon), timestamp: Date.parse(trkpt.time) };
            })
          };
        });

        done({ points: getAllPoints(laps), center: getCenter(laps)});

      });
  };

  var GpxReader = {
    getCenter: getCenter,
    getAllPoints: getAllPoints,
    getTrackFromFile: getTrackFromFile
  };

  return GpxReader;
});