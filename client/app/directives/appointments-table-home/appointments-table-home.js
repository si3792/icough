"use strict";

app.directive('cdAppointmentsTableHome', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/appointments-table-home/appointments-table-home.html',
        controller: ['$scope', '$controller', 'AccountService', 'AlertModalService', function($scope, $controller, AccountService, AlertModalService) {

            $scope.directiveName = 'appointments-table-home';

            $scope.queryParams = {
                ordering: 'time',
                page: 1
            };

            $controller('AppointmentsTableController', {
                $scope: $scope
            });

            $controller('DatepickingController', {
                $scope: $scope
            });

            $scope.fullTable = true;
            $scope.selectedAppointment = {};


            $scope.submitAppointmentReschedule = function() {

                $scope.selectedAppointment.time = $scope.datetime;
                AccountService.appointments.update({
                    appId: $scope.selectedAppointment.id
                }, $scope.selectedAppointment, function(response) {
                    AlertModalService.alert('Success', 'Your request was submitted', 'success').then(function() {
                        $scope.refreshData();
                        $scope.fullTable = true;
                    });
                }, function(response) {
                    // error
                    AlertModalService.alert('Error', 'Your request could not be processed', 'danger');
                });

            };

            $scope.selectAppointment = function(appointment) {
                angular.copy(appointment, $scope.selectedAppointment);
                $scope.fullTable = false;
            };

            $scope.clearAppointmentSelection = function() {
                $scope.fullTable = true;
            };

        }]
    }
});
