angular.module('the-map').service('LineService', function (CalculationService) {
  'use strict';


  var getTempo = function(time, distanceAsK) {
    return time/distanceAsK;
  };

/**
 * Converts laps to lines
 * @param  {Array} laps [description]
 * @return {Array}      [description]
 */
  var convertToLines = function(points) {

    var lines = [];

    var averageTempo = CalculationService.getAverageTempo(points);

    points.forEach(function(point, index) {

      var nextPoint = points[index+1];

      if (nextPoint) {
        var timeBetweenPoints = CalculationService.getTimeAsMinutes(point.timestamp, nextPoint.timestamp);
        var distanceBetweenPoints = CalculationService.getDistanceAsK(point, nextPoint);
        var tempoToNextPoint = getTempo(timeBetweenPoints, distanceBetweenPoints);

        var fasterThanTheRest = tempoToNextPoint > averageTempo;

        if (lines.length === 0 || lines[lines.length-1].faster !== fasterThanTheRest) {
          //get rid of lines with only one point
          if (lines.length > 1 && lines[lines.length-1].points.length < 2) {
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
          //add to last line
          lines[lines.length-1].points.push(point);
        }
      }
      else {
        lines[lines.length-1].points.push(point);
      }
    });

    var pointsInLines = [];
    pointsInLines.concat.apply(pointsInLines, lines.map(function(line) { return line.points; }));

    return lines;
  };

  var LineService = {
    convertToLines: convertToLines
  };

  return LineService;
}); 