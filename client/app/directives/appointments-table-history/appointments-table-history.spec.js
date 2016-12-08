"use strict";

DEBUG = false; // Turn off console logs

describe("cd-appointments-table-history", function() {

    var $rootScope, $compile, $q, $httpBackend, CONSTANTS;
    var $scope;
    var element, compiledElement;

    beforeEach(module('mainApp'));

    beforeEach(module('templates'));

    beforeEach(inject(function(_$rootScope_, _$compile_, _$q_, _$httpBackend_, _CONSTANTS_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;
        CONSTANTS = _CONSTANTS_;
    }));

    beforeEach(function() {
        $httpBackend.expectGET(CONSTANTS.BASE_URL + '/icough/history/?ordering=-time&page=1').respond(200, {});
        $httpBackend.expectGET(CONSTANTS.BASE_URL + '/account/').respond(200, {
            'groups': []
        });
        element = angular.element('<cd-appointments-table-history></cd-appointments-table-history>');
        $scope = $rootScope.$new();
        compiledElement = $compile(element)($scope);
    });

    it("should initialize correct directiveName", function() {
        $scope.$digest();
        $httpBackend.flush();
        expect($scope.directiveName).toEqual('appointments-table-history');
    });

    it("should initialize correct queryParams", function() {
        $scope.$digest();
        $httpBackend.flush();
        expect($scope.queryParams).toEqual({
            ordering: '-time',
            page: 1
        });
    });

});
