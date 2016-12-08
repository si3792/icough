/****************************************************************
 *    Template directive for displaying a table of appointments *
 ****************************************************************/

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

            $scope.fullTable = true; // Flag for displaying the full table or selectedAppointment
            $scope.selectedAppointment = {};

            /**
             *    Submits a reschedule request for an appointment,
             *    by using AccountService. Takes $scope.selectedAppointment
             *    as appointment and $scope.datetime as the new time.
             *    Displays AlertModal on success or failure.
             */
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
                    //Error
                    if('data' in response && 'message' in response.data && response.data.message == 'This request clashes with existing appointment')
                    AlertModalService.alert('Error', 'This request clashes with existing appointment', 'danger');
                    else AlertModalService.alert('Error', 'Your request could not be processed', 'danger');
                });

            };

            /**
             *    Switches table to display only selectedAppointment and
             *    copies appointment into selectedAppointment
             *
             *    @param  {Object} appointment
             */
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
