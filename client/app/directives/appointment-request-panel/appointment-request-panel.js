"use strict";

app.directive('cdAppointmentRequestPanel', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/appointment-request-panel/appointment-request-panel.html',
        controller: ['$scope', 'AccountService', 'DoctorsService', function($scope, AccountService, DoctorsService) {

            $scope.hstep = 1;
            $scope.mstep = 30;
            $scope.time = new Date();
            $scope.time.setMinutes(0);
            $scope.date;
            $scope.doctor;

            $scope.doctors = DoctorsService.doctors.query();

            $scope.datepickerOptions = {
                minDate: new Date(),
                showWeeks: true
            };

            $scope.changed = function() {
                DEBUG && console.log('Time changed to: ' + $scope.time);
            };


            $scope.isDoctor = false;
            AccountService.isDoctor().then(function(response) {
                $scope.isDoctor = response;
            });
        }]
    }
});
