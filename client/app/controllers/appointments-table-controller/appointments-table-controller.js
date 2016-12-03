/**
 *    Shared logic for
 *    - appointments-table-home
 *    - appointments-table-history
 *    - appointments-table-requests
 *    directives
 */

app.controller('AppointmentsTableController', ['$scope', 'AccountService', function($scope, AccountService) {

    $scope.RELATIVE_DATE_CUTOFF_MINUTES = 600;

    $scope.appointmentsData = {};

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

    $scope.flipPage = function(flipForward) {

        if (flipForward && $scope.appointmentsData.next != null) {
            $scope.queryParams.page += 1;
            $scope.refreshData();
        } else if (!flipForward && $scope.appointmentsData.previous != null) {
            $scope.queryParams.page -= 1;
            $scope.refreshData();
        }

    };

    $scope.setOrdering = function(order) {
        if ($scope.queryParams.ordering == order) {
            $scope.queryParams.ordering = "-" + order;
        } else $scope.queryParams.ordering = order;

        $scope.queryParams.page = 1;
        $scope.refreshData();
    };

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
    };

    $scope.getAppointmentStateName = function(state) {
        if (state == 'D') return 'Declined';
        if (state == 'A') return 'Approved';
        return 'Pending';
    };

}]);
