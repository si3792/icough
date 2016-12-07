"use strict";

DEBUG = false; // Turn off console logs

describe("cd-navbar", function() {

    var $location, $rootScope, $compile, $q;
    var $scope;

    function mockAuthService() {}

    function mockAccountService() {}

    beforeEach(module('mainApp', function($provide) {
        $provide.service('AccountService', mockAccountService);
        $provide.service('AuthService', mockAuthService);
    }));

    beforeEach(module('templates'));

    beforeEach(inject(function(_$location_, _$rootScope_, _$compile_, _$q_) {
        $location = _$location_;
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $q = _$q_;
    }));

    it("should be invisible for unauthenticated users", function() {

        mockAuthService.prototype.isAuthenticated = function() {
            return false;
        };

        mockAccountService.prototype.isDoctor = function() {
            var deferred = $q.defer();

            deferred.resolve(false);
            return deferred.promise;
        };

        var el = angular.element('<cd-navbar></cd-navbar>');
        $scope = $rootScope.$new();
        var compiledElement = $compile(el)($scope);
        $scope.$digest();
        expect(el.find('#navbar-root').hasClass('ng-hide')).toBe(true);
        expect($scope.showNavbar).toEqual(false);
    });

    it("should be visible for authenticated users", function() {

        mockAuthService.prototype.isAuthenticated = function() {
            return true;
        };

        mockAccountService.prototype.isDoctor = function() {
            var deferred = $q.defer();

            deferred.resolve(false);
            return deferred.promise;
        };

        var el = angular.element('<cd-navbar></cd-navbar>');
        $scope = $rootScope.$new();
        var compiledElement = $compile(el)($scope);
        $scope.$digest();
        expect(el.find('#navbar-root').hasClass('ng-hide')).toBe(false);
        expect($scope.showNavbar).toEqual(true);
    });

    it('should recheck data on route change', function(){

      var isAuthenticatedFlag = false;
      var isDoctorFlag = false;

      mockAuthService.prototype.isAuthenticated = function() {
          return isAuthenticatedFlag;
      };

      mockAccountService.prototype.isDoctor = function() {
          var deferred = $q.defer();

          deferred.resolve(isDoctorFlag);
          return deferred.promise;
      };

      var el = angular.element('<cd-navbar></cd-navbar>');
      $scope = $rootScope.$new();
      var compiledElement = $compile(el)($scope);
      $scope.$digest();
      expect($scope.curLocation).toEqual('');
      expect($scope.showNavbar).toEqual(false);
      expect($scope.isDoctor).toEqual(false);

      isAuthenticatedFlag = true;
      isDoctorFlag = true;
      spyOn($location, 'path').and.returnValue('/home');
      $rootScope.$broadcast('$routeChangeSuccess');
      $rootScope.$digest();
      expect($scope.curLocation).toEqual('/home');
      expect($scope.showNavbar).toEqual(true);
      expect($scope.isDoctor).toEqual(true);
    });

});
