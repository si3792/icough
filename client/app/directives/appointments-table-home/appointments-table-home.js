"use strict";

app.directive('cdAppointmentsTableHome', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/appointments-table-home/appointments-table-home.html',
        controller: ['$scope', '$controller', 'AccountService', 'AlertModalService', function($scope, $controller, AccountService, AlertModalService) {

            $scope.directiveName = 'appointments-table-home';

            $scope.queryParams = {
                //state: 'P',
                ordering: 'time',
                page: 1
            };

            $controller('AppointmentsTableController', {$scope: $scope});

            $scope.fullTable = true;
            $scope.selectedAppointment = {};

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
