"use strict";

app.directive('cdReviewRequestsTable', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/review-requests-table/review-requests-table.html',
        controller: ['$scope', 'AccountService', 'AlertModalService', function($scope, AccountService, AlertModalService) {

            $scope.RELATIVE_DATE_CUTOFF_MINUTES = 600;

            $scope.queryParams = {
                state: 'P',
                ordering: '-created',
                page: 1
            };

            $scope.refreshData = function() {
                $scope.appointmentsData = AccountService.appointments.get($scope.queryParams);
            }
            $scope.refreshData();

            $scope.isDoctor = "unknown";
            AccountService.isDoctor().then(function(response) {
                $scope.isDoctor = response;
            });

            $scope.updateRequest = function(appointment, newState) {
                DEBUG && console.log(appointment);
                appointment.state = newState;
                AccountService.appointments.update({appId: appointment.id}, appointment, function(response) {
                    $scope.refreshData();
                    if(newState == 'D') AlertModalService.alert('Declined', 'This request has been declined', 'info');
                    else if(newState == 'A') AlertModalService.alert('Approved', 'This appointment has been added to your schedule', 'success');
                });
            }

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
                if (Math.abs($scope.calculateDifference(moment(), time)) > $scope.RELATIVE_DATE_CUTOFF_MINUTES) return false;
                return true;
            }


            $scope.setOrdering = function(order) {
                if ($scope.queryParams.ordering == order) {
                    $scope.queryParams.ordering = "-" + order;
                } else $scope.queryParams.ordering = order;

                $scope.queryParams.page = 1;
                $scope.refreshData();
            }

            $scope.flipPage = function(flipForward) {

                if (flipForward && $scope.appointmentsData.next != null) {
                    $scope.queryParams.page += 1;
                    $scope.refreshData();
                } else if (!flipForward && $scope.appointmentsData.previous != null) {
                    $scope.queryParams.page -= 1;
                    $scope.refreshData();
                }

            }

        }]
    }
});
