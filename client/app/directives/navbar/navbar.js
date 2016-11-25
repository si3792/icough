/***************************************************
 *    A template directive for the Navbar.         *
 *    Hides itself when user is unauthenticated    *
 ***************************************************/


app.directive('cdNavbar', [function() {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/navbar/navbar.html',
        controller: ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {

            $scope.showNavbar = AuthService.isAuthenticated();

            /* Recheck authentication on route change */
            $scope.$on('$routeChangeSuccess', function(event, current) {
                $scope.showNavbar = AuthService.isAuthenticated();
            });
        }]
    }
}]);
