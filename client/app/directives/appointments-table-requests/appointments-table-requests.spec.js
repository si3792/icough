"use strict";

DEBUG = false; // Turn off console logs

describe("cd-appointments-table-requests", function() {

    var $rootScope, $compile, $q, $httpBackend, CONSTANTS;
    var $scope, AccountService;
    var element, compiledElement;

    function mockAlertModalService() {}

    beforeEach(module('mainApp', function($provide) {
        $provide.service('AlertModalService', mockAlertModalService);
    }));

    beforeEach(module('templates'));

    beforeEach(inject(function(_$rootScope_, _$compile_, _$q_, _$httpBackend_, _CONSTANTS_, _AccountService_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;
        CONSTANTS = _CONSTANTS_;
        AccountService = _AccountService_;
    }));

    beforeEach(function() {

        mockAlertModalService.prototype.alert = function(title, text, type) {
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        };

        $httpBackend.whenGET(CONSTANTS.BASE_URL + '/icough/appointments/?ordering=-created&page=1&state=P').respond(200, {});
        $httpBackend.whenGET(CONSTANTS.BASE_URL + '/account/').respond(200, {
            'groups': ['doctors']
        });
        element = angular.element('<cd-appointments-table-requests></cd-appointments-table-requests>');
        $scope = $rootScope.$new();
        compiledElement = $compile(element)($scope);
    });

    it("should initialize correct directiveName", function() {
        $scope.$digest();
        $httpBackend.flush();
        expect($scope.directiveName).toEqual('appointments-table-requests');
    });

    it("should initialize correct queryParams", function() {
        $scope.$digest();
        $httpBackend.flush();
        expect($scope.queryParams).toEqual({
            state: 'P',
            ordering: '-created',
            page: 1
        });
    });

    describe("updateRequest", function() {

        it("should successfully approve appointment", function() {
            spyOn(AccountService.appointments, 'update').and.callFake(function(opt, appointment, callback) {
                if (opt.appId == 1) callback();
            });
            spyOn(mockAlertModalService.prototype, 'alert').and.callThrough();

            $scope.$digest();
            $scope.updateRequest({
                'id': 1,
                'time': 'time',
                'state': 'P',
            }, 'A');
            $scope.$digest();
            expect(AccountService.appointments.update).toHaveBeenCalled();
            expect(mockAlertModalService.prototype.alert).toHaveBeenCalledWith('Approved', 'This appointment has been added to your schedule', 'success');
        });

        it("should successfully decline appointment", function() {
            spyOn(AccountService.appointments, 'update').and.callFake(function(opt, appointment, callback) {
                if (opt.appId == 1) callback();
            });
            spyOn(mockAlertModalService.prototype, 'alert').and.callThrough();

            $scope.$digest();
            $scope.updateRequest({
                'id': 1,
                'time': 'time',
                'state': 'P',
            }, 'D');
            $scope.$digest();
            expect(AccountService.appointments.update).toHaveBeenCalled();
            expect(mockAlertModalService.prototype.alert).toHaveBeenCalledWith('Declined', 'This request has been declined', 'info');
        });

    });

});
