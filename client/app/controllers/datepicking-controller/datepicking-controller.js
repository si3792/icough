/**
 *    Reusable logic for datepicking
 *
 *    Used in
 *    - appointments-table-home
 *    - appointment-request-panel
 *    directives
 */

app.controller('DatepickingController', ['$scope', function($scope) {

    $scope.hstep = 1;
    $scope.mstep = 30;
    $scope.time = new Date();
    $scope.time.setMinutes(0);
    $scope.date;
    $scope.datetime;
    $scope.datepickerOptions = {
        minDate: new Date(),
        showWeeks: true
    };


    $scope.updateDatetime = function() {
        $scope.datetime = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate(),
            $scope.time.getHours(), $scope.time.getMinutes(), $scope.time.getSeconds());
        DEBUG && console.log('Time changed to: ' + $scope.time);
    };



}]);
