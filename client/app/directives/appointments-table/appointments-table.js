"use strict";

app.directive('cdAppointmentsTable', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/appointments-table/appointments-table.html',
        controller: ['$scope', 'AccountService', 'AlertModalService', 'CONSTANTS', function($scope, AccountService, AlertModalService, CONSTANTS) {

          $scope.appointmentsData = AccountService.appointments.query();

        }]
    }
});
