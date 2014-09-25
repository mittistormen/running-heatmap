angular.module('the-map').service('CalculationService', function () {
  'use strict';

  var getDistanceAsK = function(startingPoint, endingPoint) {
    var lat1 = startingPoint.latitude;
    var lat2 = endingPoint.latitude;
    var lon1 = startingPoint.longitude;
    var lon2 = endingPoint.longitude;

    Number.prototype.toRad = function() { return this * (Math.PI / 180); };

    var R = 6371; // km
    var dLat = (lat2-lat1).toRad();
    var dLon = (lon2-lon1).toRad();
    lat1 = lat1.toRad();
    lat2 = lat2.toRad();

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;

    return d;
  };

  var getTimeAsMinutes = function (startTime, endTime) {
    return (endTime - startTime) / 1000 / 60;
  };


  var getTotalTimeAsMinutes = function(points) {

    var startTime = points[0].timestamp;
    var endTime = points[points.length-1].timestamp;

    return getTimeAsMinutes (startTime, endTime);
  };

  var getAverageTempo = function(points) {
    return getTotalTimeAsMinutes(points) / getTotalDistanceAsK(points);
  };


  var getTotalDistanceAsK = function(points) {

    var totalDistance = 0;

    points.forEach(function(point, index) {

      var nextPoint = points[index+1];
      if (nextPoint)  {
        totalDistance += getDistanceAsK(point, nextPoint);
      }
    });

    return totalDistance;
  };

  function getDistanceBetweenTwoPointsInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  var CalculationService = {
    getTotalDistanceAsK: getTotalDistanceAsK,
    getTotalTimeAsMinutes: getTotalTimeAsMinutes,
    getAverageTempo: getAverageTempo,
    getTimeAsMinutes: getTimeAsMinutes,
    getDistanceAsK: getDistanceAsK,
    getDistanceBetweenTwoPointsInKm: getDistanceBetweenTwoPointsInKm
  };

  return CalculationService;
});