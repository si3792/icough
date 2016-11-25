"use strict";

app.directive('cdAppointmentsTable', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/appointments-table/appointments-table.html',
        controller: ['$scope', 'AccountService', function($scope, AccountService) {

            $scope.queryParams = {
              //state: 'P',
              ordering: '-time'
            };

            $scope.RELATIVE_DATE_CUTOFF_MINUTES = 600;

            $scope.isDoctor = false;
            AccountService.isDoctor().then(function(response) {
                $scope.isDoctor = response;
            });

            $scope.refreshData = function() {
              $scope.appointmentsData = AccountService.appointments.query($scope.queryParams);
            }
            $scope.refreshData();

            /**
             *    Function to calculate difference between two dates
             */
            $scope.calculateDifference = function(time1, time2) {
                return time1.diff(time2, 'minutes');
            };

            /**
             *    Function that returns True or False,
             *    based on whether a date should be displayed
             *    as an absolute or relative to the current time.
             */
            $scope.displayRelative = function(time) {
                if ( Math.abs($scope.calculateDifference(moment(), time)) > $scope.RELATIVE_DATE_CUTOFF_MINUTES) return false;
                return true;
            }

            $scope.getAppointmentStateName = function(state) {
              if(state == 'D') return 'Declined';
              if(state == 'A') return 'Approved';
              return 'Pending';
            }

            $scope.setOrdering = function(order) {
              if($scope.queryParams.ordering == order) {
                  $scope.queryParams.ordering = "-" + order;
              }
              else  $scope.queryParams.ordering = order;
                $scope.refreshData();
            }

        }]
    }
});
