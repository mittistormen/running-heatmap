angular.module('the-map').controller('LabCtrl', function ($scope, $http) {
  'use strict';
  /*global X2JS */
  var x2js = new X2JS(); 

  $scope.map = {
    showTrack: false
  };

  $scope.kungsholmenMap = {
    ready: false
  };


  var getCenter = function(laps) {
    var middleLap = laps[Math.round(laps.length/2)];

    var point = middleLap.points[0];

    return point;
  };

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

  var getAllPoints = function(laps) {
    var allPoints = [];
    allPoints = allPoints.concat.apply(allPoints, laps.map(function(lap) { return lap.points; }));
    console.log(allPoints.length);

    return allPoints;
  };

  var getTotalDistanceAsK = function(laps) {

    var allPoints = getAllPoints(laps);

    var totalDistance = 0;

    allPoints.forEach(function(point, index) {

      var nextPoint = allPoints[index+1];
      if (nextPoint)  {
        totalDistance += getDistanceAsK(point, nextPoint);
      }
    });

    return totalDistance;
  };

  var getTotalTimeAsMinutes = function(laps) {

    var startTime = laps[0].points[0].timestamp;
    var endTime = laps[laps.length-1].points[laps[laps.length-1].points.length-1].timestamp;


    return getTimeAsMinutes (startTime, endTime);
  };

  var getTimeAsMinutes = function (startTime, endTime) {
    return (endTime - startTime) / 1000 / 60;
  };

  var getAverageTempo = function(laps) {
    return getTotalTimeAsMinutes(laps) / getTotalDistanceAsK(laps);
  };

  var getTempo = function(time, distanceAsK) {
    return time/distanceAsK;
  };

  var shopMap = function(laps) {

    var center = getCenter(laps);

    $scope.map = {
        center: {
            latitude: center.latitude,
            longitude: center.longitude
        },
        zoom: 14,
        laps: laps,
        showTrack: true,
        distance: getTotalDistanceAsK(laps),
        time: getTotalTimeAsMinutes(laps),
        averageTempo: getAverageTempo(laps)
    };
  };

  var getLinesFromLaps = function(laps) {

    var lines = [];

    var points = getAllPoints(laps);

    var averageTempo = getAverageTempo(laps);

    points.forEach(function(point, index) {

      var nextPoint = points[index+1];

      if (nextPoint) {
        var timeBetweenPoints = getTimeAsMinutes(point.timestamp, nextPoint.timestamp);
        var distanceBetweenPoints = getDistanceAsK(point, nextPoint);
        var tempoToNextPoint = getTempo(timeBetweenPoints, distanceBetweenPoints);

        var fasterThanTheRest = tempoToNextPoint > averageTempo;

        if (lines.length === 0 || lines[lines.length-1].faster !== fasterThanTheRest) {
          console.log('addNew');
          if (lines.length > 1 && lines[lines.length-1].points.length < 2) {
            //get rid of lines with only one point

            //add point to previous one
            lines[lines.length-2].points.concat(lines[lines.length-1].points);
            //remove it
            lines.splice(lines.length-1, 1);

            //add to previous line
            lines[lines.length-1].points.push(point);
          }
          else {
          
            //add new line
            if (lines.length > 0) {
              //close last line
              lines[lines.length-1].points.push(point);
            }
            var stroke = fasterThanTheRest ? { color: 'green', weight:1 } : { color: 'red', weight:1 };

            lines.push({points:[point], faster:fasterThanTheRest, stroke:stroke });
          }
        }
        else {
          console.log('add to last');

          //add to last line
          lines[lines.length-1].points.push(point);
        }

      }
      else {
        console.log('add last line');
        lines[lines.length-1].points.push(point);
      }

    });

    var pointsInLines = [];
    pointsInLines.concat.apply(pointsInLines, lines.map(function(line) { return line.points; }));

    console.log('number of points', points.length);
    console.log('number of points in lines', pointsInLines.length);

    return lines;
  };

  // $http.get('http://localhost:9001/test-data/test2.xml')
  //   .then(function(response) {
      
  //     var data = x2js.xml_str2json(response.data);

  //     console.log(data);


  //       var laps = data.gpx.trk.trkseg.map(function(trkseg) {
  //         return { points: trkseg.trkpt.map(function(trkpt) {
  //           return { latitude: parseFloat(trkpt._lat), longitude: parseFloat(trkpt._lon), timestamp: Date.parse(trkpt.time) };
  //           })
  //         };
  //       });

  //       shopMap(laps);


  //   });

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

      var lines = getLinesFromLaps(laps);

      var center = getCenter(laps);

      console.log('lines', lines);

      $scope.kungsholmenMap = {
          center: {
              latitude: center.latitude,
              longitude: center.longitude
          },
          zoom: 14,
          lines: lines,
          ready: true,
          distance: getTotalDistanceAsK(laps),
          time: getTotalTimeAsMinutes(laps),
          averageTempo: getAverageTempo(laps)
      };


    });

});