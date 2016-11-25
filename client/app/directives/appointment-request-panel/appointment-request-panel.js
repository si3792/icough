"use strict";

app.directive('cdAppointmentRequestPanel', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/appointment-request-panel/appointment-request-panel.html',
        controller: ['$scope', 'AccountService', 'AlertModalService', 'CONSTANTS', function($scope, AccountService) {

            $scope.isDoctor = false;
            AccountService.isDoctor().then(function(response) {
                $scope.isDoctor = response;
            });
        }]
    }
});
