/******************************************************************
 *    A directive for displaying the current time using moment.js *
 ******************************************************************/

"use strict";

app.directive('cdCurrentTime', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/current-time/current-time.html',
        controller: ['$scope', '$interval', function($scope, $interval) {

            $scope.now = moment();

            $interval(function() {
                $scope.now = moment();
            }, 1000);

        }]
    }
});
