/*************************************************************
 *    Small directive for displaying the current user's name *
 *************************************************************/

"use strict";

 app.directive('cdUserName', function() {
     return {
         restrict: 'E',
         templateUrl: 'app/directives/user-name/user-name.html',
         controller: ['$scope', 'AccountService', function($scope, AccountService) {
            $scope.accountData = AccountService.account.get({}, function(response){
              $scope.name = $scope.accountData.first_name + " " + $scope.accountData.last_name;
            }, function(response){
              $scope.name = "User";
            });

         }]
     }
 });
