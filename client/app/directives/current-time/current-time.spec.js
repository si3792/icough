"use strict";

DEBUG = false; // Turn off console logs

describe("cd-current-time", function() {

    var $rootScope, $compile;
    var $scope;

    beforeEach(module('mainApp'));

    beforeEach(module('templates'));

    beforeEach(inject(function(_$rootScope_, _$compile_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
    }));

    it("should intirialize now to current time", function() {

        var element = angular.element('<cd-current-time></cd-current-time>');
        $scope = $rootScope.$new();
        var compiledElement = $compile(element)($scope);
        $scope.$apply();

        expect(moment().diff($scope.now, 'ms')).toBeLessThan(1000);
    });

});
