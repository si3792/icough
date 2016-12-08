/**
 *    Shared logic for
 *    - appointments-table-home
 *    - appointments-table-history
 *    - appointments-table-requests
 *    directives
 */

"use strict";

app.controller('AppointmentsTableController', ['$scope', 'AccountService', function($scope, AccountService) {

    $scope.RELATIVE_DATE_CUTOFF_MINUTES = 600;

    $scope.appointmentsData = {};

    /**
     *    Fetches appointments data using AccountService and
     *    stores it in $scope.appointmentsData. Depending on
     *    $scope.directiveName can fetch either history (old appointments)
     *    or appointments (upcoming appointments)
     */
    $scope.refreshData = function() {
        if($scope.directiveName == 'appointments-table-history') {
        $scope.appointmentsData = AccountService.history.get($scope.queryParams);
      } else {
        $scope.appointmentsData = AccountService.appointments.get($scope.queryParams);
      }
    }
    $scope.refreshData();


    $scope.isDoctor = "unknown";
    AccountService.isDoctor().then(function(response) {
        $scope.isDoctor = response;
        if (response && $scope.directiveName == 'appointments-table-home') {
            $scope.queryParams.state = 'A';
            $scope.refreshData();
        }
    });

    /**
     *    Function for flipping through pages of paginated appointments data.
     *
     *    @param  {Boolean} flipForward Requests next or previous page depending on this flag
     */
    $scope.flipPage = function(flipForward) {

        if (flipForward && $scope.appointmentsData.next != null) {
            $scope.queryParams.page += 1;
            $scope.refreshData();
        } else if (!flipForward && $scope.appointmentsData.previous != null) {
            $scope.queryParams.page -= 1;
            $scope.refreshData();
        }

    };

    /**
     *    Function for setting the order of appointments.
     *    Updates queryParams and fetches data through refreshData()
     *
     *    @param {String} order The ordering field
     */
    $scope.setOrdering = function(order) {
        if ($scope.queryParams.ordering == order) {
            $scope.queryParams.ordering = "-" + order;
        } else $scope.queryParams.ordering = order;

        $scope.queryParams.page = 1;
        $scope.refreshData();
    };

    /**
     *    Function to calculate difference between two dates in minutes
     *
     *    @param  {Date} time1
     *    @param  {Date} time2
     *
     *    @return Number of minutes between time1 and time2
     */
    $scope.calculateDifference = function(time1, time2) {
        return moment(time1).diff(time2, 'minutes');
    };

    /**
     *    Function that returns True or False,
     *    based on whether a date should be displayed
     *    as an absolute or relative to the current time.
     *
     *    @param  {Date} time
     *
     *    @return {Boolean} Whether relative representation should be used
     */
    $scope.displayRelative = function(time) {
        if (Math.abs($scope.calculateDifference(moment(), time)) > $scope.RELATIVE_DATE_CUTOFF_MINUTES) return false;
        return true;
    };

    /**
     *    Returns the full name for an appointment's state
     *
     *    @param  {Char} state
     *
     *    @return {String} Full name
     */
    $scope.getAppointmentStateName = function(state) {
        if (state == 'D') return 'Declined';
        if (state == 'A') return 'Approved';
        return 'Pending';
    };

}]);
