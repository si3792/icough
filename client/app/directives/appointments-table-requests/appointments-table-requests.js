/*************************************************************
 *    Template directive for displaying appointment requests *
 *************************************************************/

"use strict";

app.directive('cdAppointmentsTableRequests', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/appointments-table-requests/appointments-table-requests.html',
        controller: ['$scope', '$controller', 'AccountService', 'AlertModalService', function($scope, $controller, AccountService, AlertModalService) {

            $scope.directiveName = 'appointments-table-requests';

            $scope.queryParams = {
                state: 'P',
                ordering: '-created',
                page: 1
            };

            $controller('AppointmentsTableController', {$scope: $scope});

            /**
             *    Takes a pending appointment and tries to update its state
             *    to either 'A' or 'D' using AccountService. Displays AlertModal in
             *    case of success or error.
             *
             *    @param  {Object} appointment Appointment object
             *    @param  {String} newState    Either 'A' or 'D'
             *
             */
            $scope.updateRequest = function(appointment, newState) {
                DEBUG && console.log(appointment);
                appointment.state = newState;
                AccountService.appointments.update({appId: appointment.id}, appointment, function(response) {
                    $scope.refreshData();
                    if(newState == 'D') AlertModalService.alert('Declined', 'This request has been declined', 'info');
                    else if(newState == 'A') AlertModalService.alert('Approved', 'This appointment has been added to your schedule', 'success');
                }, function(response){
                  AlertModalService.alert('Error', 'An error occured processing this.', 'danger');
                });
            }

        }]
    }
});
