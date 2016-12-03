"use strict";

app.directive('cdAppointmentRequestPanel', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/appointment-request-panel/appointment-request-panel.html',
        controller: ['$scope', '$controller', '$location', 'AccountService', 'DoctorsService', 'AlertModalService', function($scope, $controller, $location, AccountService, DoctorsService, AlertModalService) {

            $controller('DatepickingController', {
                $scope: $scope
            });

            $scope.doctors = DoctorsService.doctors.query();

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
