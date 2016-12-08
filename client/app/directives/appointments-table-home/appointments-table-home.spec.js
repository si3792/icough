"use strict";

DEBUG = false; // Turn off console logs

describe("cd-appointments-table-home", function() {

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

        $httpBackend.whenGET(CONSTANTS.BASE_URL + '/icough/appointments/?ordering=time&page=1').respond(200, {});
        $httpBackend.whenGET(CONSTANTS.BASE_URL + '/account/').respond(200, {
            'groups': ['doctors']
        });
        element = angular.element('<cd-appointments-table-home></cd-appointments-table-home>');
        $scope = $rootScope.$new();
        compiledElement = $compile(element)($scope);
    });

    it("should initialize correct directiveName", function() {
        $scope.$digest();
        $httpBackend.flush();
        expect($scope.directiveName).toEqual('appointments-table-home');
    });

    it("should initialize correct queryParams", function() {
        $scope.$digest();
        $httpBackend.flush();
        expect($scope.queryParams).toEqual({
            ordering: 'time',
            page: 1
        });
    });

    describe("submitAppointmentReschedule", function() {

        it("should successfully submit appointment reschedule request", function() {

            $scope.$digest();
            $scope.selectedAppointment = {
                'id': 1,
                'data': 'dummydata'
            }
            spyOn(AccountService.appointments, 'update').and.callFake(function(opt, appointment, callback, errorCallback) {
                if (opt.appId == 1 && angular.equals(appointment, {
                        'id': 1,
                        'data': 'dummydata'
                    })) callback();
                else errorCallback();
            });
            spyOn(mockAlertModalService.prototype, 'alert').and.callThrough();
            $scope.submitAppointmentReschedule();
            $scope.$digest();
            expect(mockAlertModalService.prototype.alert).toHaveBeenCalledWith('Success', 'Your request was submitted', 'success');
            expect($scope.fullTable).toEqual(true);
        });

        it("should display an error when reschedule request clashes", function() {

            $scope.$digest();
            spyOn(AccountService.appointments, 'update').and.callFake(function(opt, appointment, callback, errorCallback) {
                errorCallback({
                  'data': {
                    'message': 'This request clashes with existing appointment'
                  }
                });
            });
            spyOn(mockAlertModalService.prototype, 'alert').and.callThrough();
            $scope.submitAppointmentReschedule();
            $scope.$digest();
            expect(mockAlertModalService.prototype.alert).toHaveBeenCalledWith('Error', 'This request clashes with existing appointment', 'danger');
        });

        it("should display a generic error in case of failure", function() {

            $scope.$digest();
            spyOn(AccountService.appointments, 'update').and.callFake(function(opt, appointment, callback, errorCallback) {
                errorCallback({
                  'data': {}
                });
            });
            spyOn(mockAlertModalService.prototype, 'alert').and.callThrough();
            $scope.submitAppointmentReschedule();
            $scope.$digest();
            expect(mockAlertModalService.prototype.alert).toHaveBeenCalledWith('Error', 'Your request could not be processed', 'danger');
        });

    });

    describe("selectAppointment", function() {

        it("should copy appointment into selectedAppointment and set fullTable to false", function() {

            $scope.$digest();
            var appointment = {
                'appointment_data': 'someDummyData'
            };
            $scope.fullTable = true;
            $scope.selectAppointment(appointment);
            expect($scope.selectedAppointment).toEqual(appointment);
            expect($scope.fullTable).toEqual(false);
        });

    });

    describe("clearAppointmentSelection", function() {

        it("should set fullTable to true", function() {
            $scope.$digest();
            $scope.fullTable = false;
            $scope.clearAppointmentSelection();
            expect($scope.fullTable).toEqual(true);
        });

    });

});
