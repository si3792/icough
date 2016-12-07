"use strict";

DEBUG = false; // Turn off console logs

describe("cd-user-name", function() {

    var $rootScope, $compile;
    var $scope;

    function mockAccountService() {}

    beforeEach(module('mainApp', function($provide) {
        $provide.service('AccountService', mockAccountService);
    }));

    beforeEach(module('templates'));

    beforeEach(inject(function(_$rootScope_, _$compile_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
    }));

    it("should set name from AccountService", function() {

        mockAccountService.prototype.account = {};
        mockAccountService.prototype.account.get = function(opt, callback, errorCallback) {
            callback({
                'first_name': 'foo',
                'last_name': 'bar'
            });
        };

        var element = angular.element('<cd-user-name></cd-user-name>');
        $scope = $rootScope.$new();
        var compiledElement = $compile(element)($scope);
        $scope.$digest();
        expect($scope.name).toBe('foo bar');

    });

    it("should set name to 'User' in case of an error", function() {

        mockAccountService.prototype.account = {};
        mockAccountService.prototype.account.get = function(opt, callback, errorCallback) {
            errorCallback();
        };

        var element = angular.element('<cd-user-name></cd-user-name>');
        $scope = $rootScope.$new();
        var compiledElement = $compile(element)($scope);
        $scope.$digest();
        expect($scope.name).toBe('User');

    });

});
