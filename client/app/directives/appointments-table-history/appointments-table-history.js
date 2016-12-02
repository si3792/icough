"use strict";

app.directive('cdAppointmentsTableHistory', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/appointments-table-history/appointments-table-history.html',
        controller: ['$scope', '$controller', 'AccountService', function($scope, $controller, AccountService) {

            $scope.directiveName = 'appointments-table-history';

            $scope.queryParams = {
                ordering: '-time',
                page: 1
            };

            $controller('AppointmentsTableController', {
                $scope: $scope
            });

        }]
    }
});
