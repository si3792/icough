"use strict";

app.directive('cdAppointmentRequestPanel', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/appointment-request-panel/appointment-request-panel.html',
        controller: ['$scope', '$location', 'AccountService', 'DoctorsService', 'AlertModalService', function($scope, $location, AccountService, DoctorsService, AlertModalService) {

            $scope.hstep = 1;
            $scope.mstep = 30;
            $scope.time = new Date();
            $scope.time.setMinutes(0);
            $scope.date;
            $scope.doctor;
            $scope.datetime;

            $scope.doctors = DoctorsService.doctors.query();

            $scope.datepickerOptions = {
                minDate: new Date(),
                showWeeks: true
            };

            $scope.changed = function() {
                $scope.datetime = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate(),
                    $scope.time.getHours(), $scope.time.getMinutes(), $scope.time.getSeconds());
                DEBUG && console.log('Time changed to: ' + $scope.time);
            };

            $scope.requestAppointment = function() {
                AccountService.appointments.save({}, {
                    'time': $scope.datetime,
                    'doctor': $scope.doctor
                }, function(response) {
                    AlertModalService.alert('Success', 'Your appointment request was created!', 'success').then(
                        function(response) {
                            $location.path('/home')
                        }
                    );
                    DEBUG && console.log(response);
                }, function(response) {
                    // error
                    DEBUG && console.log(response);
                });
            };

            $scope.isDoctor = false;
            AccountService.isDoctor().then(function(response) {
                $scope.isDoctor = response;
            });
        }]
    }
});
