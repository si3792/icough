"use strict";

app.directive('cdAppointmentsTableHome', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/appointments-table-home/appointments-table-home.html',
        controller: ['$scope', 'AccountService', 'AlertModalService', function($scope, AccountService, AlertModalService) {


            $scope.hstep = 1;
            $scope.mstep = 30;
            $scope.time = new Date();
            $scope.time.setMinutes(0);
            $scope.date;
            $scope.datetime;
            $scope.datepickerOptions = {
                minDate: new Date(),
                showWeeks: true
            };

            $scope.changed = function() {
                $scope.datetime = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate(),
                    $scope.time.getHours(), $scope.time.getMinutes(), $scope.time.getSeconds());
                DEBUG && console.log('Time changed to: ' + $scope.time);
            };

            $scope.submitAppointmentReschedule = function() {

              $scope.selectedAppointment.time = $scope.datetime;
              AccountService.appointments.update({appId: $scope.selectedAppointment.id}, $scope.selectedAppointment, function(response) {
                  AlertModalService.alert('Success', 'Your request was submitted', 'success').then(function(){
                    $scope.refreshData();
                    $scope.fullTable = true;
                  });
              }, function(response){
                // error
                AlertModalService.alert('Error', 'Your request could not be processed', 'danger');
              });

            };

            $scope.RELATIVE_DATE_CUTOFF_MINUTES = 600;
            $scope.fullTable = true;
            $scope.selectedAppointment = {};

            $scope.queryParams = {
                //state: 'P',
                ordering: 'time',
                page: 1
            };


            $scope.refreshData = function() {
                $scope.appointmentsData = AccountService.appointments.get($scope.queryParams);
            }
            $scope.refreshData();

            $scope.isDoctor = "unknown";
            AccountService.isDoctor().then(function(response) {
                $scope.isDoctor = response;
                if (response) {
                    $scope.queryParams.state = 'A';
                    $scope.refreshData();
                }
            });


            $scope.selectAppointment = function(appointment) {
                angular.copy(appointment, $scope.selectedAppointment);
                $scope.fullTable = false;
            };

            $scope.clearAppointmentSelection = function() {
                $scope.fullTable = true;
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

            $scope.getAppointmentStateName = function(state) {
                if (state == 'D') return 'Declined';
                if (state == 'A') return 'Approved';
                return 'Pending';
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
