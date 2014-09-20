angular.module('the-map').service('LapService', function () {
  'use strict';

  var getAllPoints = function(laps) {
    var allPoints = [];
    allPoints = allPoints.concat.apply(allPoints, laps.map(function(lap) { return lap.points; }));
    console.log(allPoints.length);

    return allPoints;
  };


  var getCenter = function(laps) {
    var middleLap = laps[Math.round(laps.length/2)];

    var point = middleLap.points[0];

    return point;
  };

  var LapService = {
    getCenter: getCenter,
    getAllPoints: getAllPoints
  };

  return LapService;
});