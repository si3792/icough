/***************************************************
 *    A template directive for the Navbar.         *
 *    Hides itself when user is unauthenticated    *
 ***************************************************/


app.directive('cdNavbar', [function() {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/navbar/navbar.html',
        controller: ['$scope', '$location', 'AuthService', 'AccountService', function($scope, $location, AuthService, AccountService) {

            $scope.showNavbar = AuthService.isAuthenticated();

            $scope.isDoctor = false;
            AccountService.isDoctor().then(function(response) {
                $scope.isDoctor = response;
            });

            /* Recheck data on route change */
            $scope.$on('$routeChangeSuccess', function(event, current) {
                $scope.showNavbar = AuthService.isAuthenticated();

                AccountService.isDoctor().then(function(response) {
                    $scope.isDoctor = response;
                });
            });
        }]
    }
}]);
