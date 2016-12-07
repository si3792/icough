/*************************************************************
 *    Small directive for displaying the current user's name *
 *************************************************************/

"use strict";

app.directive('cdUserName', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/user-name/user-name.html',
        controller: ['$scope', 'AccountService', function($scope, AccountService) {
            AccountService.account.get({}, function(response) {
                DEBUG && console.log(response);
                $scope.accountData = response;
                $scope.name = $scope.accountData.first_name + " " + $scope.accountData.last_name;
            }, function(response) {
                $scope.name = "User";
            });

        }]
    }
});
