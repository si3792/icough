"use strict";

DEBUG = false; // Turn off console logs

describe("appointments-table-controller", function() {

    var $rootScope, $controller, $q;
    var $scope, controller;

    function mockAccountService() {}

    beforeEach(module('mainApp', function($provide) {
        $provide.service('AccountService', mockAccountService);
    }));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$q_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $q = _$q_;
    }));

    it("should set isDoctor", function() {

        mockAccountService.prototype.isDoctor = function() {
            var deferred = $q.defer();

            deferred.resolve(false);
            return deferred.promise;
        };

        mockAccountService.prototype.appointments = {};
        mockAccountService.prototype.appointments.get = function(opt) {
            return {};
        };

        mockAccountService.prototype.history = {};
        mockAccountService.prototype.history.get = function(opt) {
            return {};
        };

        $scope = $rootScope.$new();
        controller = $controller('AppointmentsTableController', {
            '$scope': $scope
        });

        $scope.$digest();
        expect($scope.isDoctor).toEqual(false);

    });

    it("should set isDoctor (2)", function() {

        mockAccountService.prototype.isDoctor = function() {
            var deferred = $q.defer();

            deferred.resolve(false);
            return deferred.promise;
        };

        mockAccountService.prototype.appointments = {};
        mockAccountService.prototype.appointments.get = function(opt) {
            return {};
        };

        mockAccountService.prototype.history = {};
        mockAccountService.prototype.history.get = function(opt) {
            return {};
        };

        $scope = $rootScope.$new();
        controller = $controller('AppointmentsTableController', {
            '$scope': $scope
        });

        $scope.$digest();
        expect($scope.isDoctor).toEqual(false);

    });

    it("should set queryParams state to 'A' if directiveName is `appointments-table-home` and isDoctor", function() {

        mockAccountService.prototype.isDoctor = function() {
            var deferred = $q.defer();

            deferred.resolve(true);
            return deferred.promise;
        };

        mockAccountService.prototype.appointments = {};
        mockAccountService.prototype.appointments.get = function(opt) {
            return {};
        };

        mockAccountService.prototype.history = {};
        mockAccountService.prototype.history.get = function(opt) {
            return {};
        };

        $scope = $rootScope.$new();
        $scope.directiveName = 'appointments-table-home';
        $scope.queryParams = {};
        controller = $controller('AppointmentsTableController', {
            '$scope': $scope
        });

        $scope.$digest();
        expect($scope.isDoctor).toEqual(true);
        expect($scope.queryParams.state).toEqual('A');
    });

    describe("refreshData", function() {

        it("should fetch history data if directiveName='appointments-table-history'", function() {

            mockAccountService.prototype.isDoctor = function() {
                var deferred = $q.defer();

                deferred.resolve(true);
                return deferred.promise;
            };

            mockAccountService.prototype.history = {};
            mockAccountService.prototype.history.get = function(opt) {
                return {
                    'data': 'data'
                };
            };
            spyOn(mockAccountService.prototype.history, 'get').and.callThrough();

            $scope = $rootScope.$new();
            $scope.directiveName = 'appointments-table-history';
            $scope.queryParams = {};
            controller = $controller('AppointmentsTableController', {
                '$scope': $scope
            });

            expect(mockAccountService.prototype.history.get).toHaveBeenCalled();
            expect($scope.appointmentsData).toEqual({
                'data': 'data'
            });
        });

        it("should fetch appointments data if directiveName != 'appointments-table-history'", function() {

            mockAccountService.prototype.isDoctor = function() {
                var deferred = $q.defer();

                deferred.resolve(true);
                return deferred.promise;
            };

            mockAccountService.prototype.appointments = {};
            mockAccountService.prototype.appointments.get = function(opt) {
                return {
                    'data': 'data'
                };
            };
            spyOn(mockAccountService.prototype.appointments, 'get').and.callThrough();

            $scope = $rootScope.$new();
            $scope.directiveName = 'appointments-table-home';
            $scope.queryParams = {};
            controller = $controller('AppointmentsTableController', {
                '$scope': $scope
            });

            expect(mockAccountService.prototype.appointments.get).toHaveBeenCalled();
            expect($scope.appointmentsData).toEqual({
                'data': 'data'
            });
        });


    });


    describe("flipPage", function() {

        beforeEach(function() {
            mockAccountService.prototype.isDoctor = function() {
                var deferred = $q.defer();

                deferred.resolve(true);
                return deferred.promise;
            };

            mockAccountService.prototype.appointments = {};
            mockAccountService.prototype.appointments.get = function(opt) {
                return {
                    'data': 'data'
                };
            };

        });

        it("should flip page forward when possible", function() {

            $scope = $rootScope.$new();
            $scope.directiveName = 'appointments-table-home';
            $scope.queryParams = {
                'page': 1
            };

            controller = $controller('AppointmentsTableController', {
                '$scope': $scope
            });

            spyOn($scope, 'refreshData');
            $scope.appointmentsData.next = 'some-url';
            $scope.flipPage(true);
            $scope.$digest();
            expect($scope.queryParams.page).toEqual(2);
            expect($scope.refreshData.calls.count()).toEqual(2);
        });

        it("should flip page back when possible", function() {

            $scope = $rootScope.$new();
            $scope.directiveName = 'appointments-table-home';
            $scope.queryParams = {
                'page': 3
            };

            controller = $controller('AppointmentsTableController', {
                '$scope': $scope
            });

            spyOn($scope, 'refreshData');
            $scope.appointmentsData.previous = 'some-url';
            $scope.flipPage(false);
            $scope.$digest();
            expect($scope.queryParams.page).toEqual(2);
            expect($scope.refreshData.calls.count()).toEqual(2);
        });


        it("should not flip page when it doesn't exist", function() {

            $scope = $rootScope.$new();
            $scope.directiveName = 'appointments-table-home';
            $scope.queryParams = {
                'page': 3
            };

            controller = $controller('AppointmentsTableController', {
                '$scope': $scope
            });

            spyOn($scope, 'refreshData');
            $scope.flipPage(false);
            $scope.$digest();
            expect($scope.queryParams.page).toEqual(3);
            expect($scope.refreshData.calls.count()).toEqual(1);
        });

        it("should not flip page when it doesn't exist (2)", function() {

            $scope = $rootScope.$new();
            $scope.directiveName = 'appointments-table-home';
            $scope.queryParams = {
                'page': 3
            };

            controller = $controller('AppointmentsTableController', {
                '$scope': $scope
            });

            spyOn($scope, 'refreshData');
            $scope.flipPage(true);
            $scope.$digest();
            expect($scope.queryParams.page).toEqual(3);
            expect($scope.refreshData.calls.count()).toEqual(1);
        });

    });

    describe("setOrdering", function() {

        beforeEach(function() {
            mockAccountService.prototype.isDoctor = function() {
                var deferred = $q.defer();

                deferred.resolve(true);
                return deferred.promise;
            };

            mockAccountService.prototype.appointments = {};
            mockAccountService.prototype.appointments.get = function(opt) {
                return {
                    'data': 'data'
                };
            };

        });

        it("should set ordering and call refreshData()", function() {

            $scope = $rootScope.$new();
            $scope.queryParams = {
                'ordering': 'default'
            };

            controller = $controller('AppointmentsTableController', {
                '$scope': $scope
            });

            spyOn($scope, 'refreshData');
            $scope.setOrdering('time');
            $scope.$digest();

            expect($scope.queryParams.ordering).toEqual('time');
            expect($scope.queryParams.page).toEqual(1);
            expect($scope.refreshData).toHaveBeenCalled();
        });

        it("should reverse ordering when ordering==queryParams.ordering and call refreshData()", function() {

            $scope = $rootScope.$new();
            $scope.queryParams = {
                'ordering': 'time'
            };

            controller = $controller('AppointmentsTableController', {
                '$scope': $scope
            });

            spyOn($scope, 'refreshData');
            $scope.setOrdering('time');
            $scope.$digest();

            expect($scope.queryParams.ordering).toEqual('-time');
            expect($scope.queryParams.page).toEqual(1);
            expect($scope.refreshData).toHaveBeenCalled();
        });

    });

    describe("calculateDifference", function() {

        it("should correctly calculate difference between two dates", function() {

            mockAccountService.prototype.isDoctor = function() {
                var deferred = $q.defer();

                deferred.resolve(true);
                return deferred.promise;
            };

            mockAccountService.prototype.appointments = {};
            mockAccountService.prototype.appointments.get = function(opt) {
                return {
                    'data': 'data'
                };
            };

            controller = $controller('AppointmentsTableController', {
                '$scope': $scope
            });

            var time1 = new Date(2016, 12, 24, 1, 30);
            var time2 = new Date(2016, 12, 24, 1, 45);
            var diff = $scope.calculateDifference(time1, time2);
            expect(diff).toEqual(-15);
        });

    });

    describe("displayRelative", function() {

        it("should return true when difference is smaller than RELATIVE_DATE_CUTOFF_MINUTES", function() {

            mockAccountService.prototype.isDoctor = function() {
                var deferred = $q.defer();

                deferred.resolve(true);
                return deferred.promise;
            };

            mockAccountService.prototype.appointments = {};
            mockAccountService.prototype.appointments.get = function(opt) {
                return {
                    'data': 'data'
                };
            };

            controller = $controller('AppointmentsTableController', {
                '$scope': $scope
            });

            var time = moment().add($scope.RELATIVE_DATE_CUTOFF_MINUTES - 5, 'minutes');
            var flag = $scope.displayRelative(time);
            expect(flag).toEqual(true);
        });

        it("should return false when difference is smaller than RELATIVE_DATE_CUTOFF_MINUTES", function() {

            mockAccountService.prototype.isDoctor = function() {
                var deferred = $q.defer();

                deferred.resolve(true);
                return deferred.promise;
            };

            mockAccountService.prototype.appointments = {};
            mockAccountService.prototype.appointments.get = function(opt) {
                return {
                    'data': 'data'
                };
            };

            controller = $controller('AppointmentsTableController', {
                '$scope': $scope
            });

            var time = moment().add($scope.RELATIVE_DATE_CUTOFF_MINUTES + 5, 'minutes');
            var flag = $scope.displayRelative(time);
            expect(flag).toEqual(false);
        });

    });

    describe("getAppointmentStateName", function() {

        beforeEach(function() {
            mockAccountService.prototype.isDoctor = function() {
                var deferred = $q.defer();

                deferred.resolve(true);
                return deferred.promise;
            };

            mockAccountService.prototype.appointments = {};
            mockAccountService.prototype.appointments.get = function(opt) {
                return {
                    'data': 'data'
                };
            };

            controller = $controller('AppointmentsTableController', {
                '$scope': $scope
            });
        });

        it("should return correct full name for 'D'", function () {
          expect($scope.getAppointmentStateName('D')).toEqual('Declined');
        });

        it("should return correct full name for 'A'", function () {
          expect($scope.getAppointmentStateName('A')).toEqual('Approved');
        });

        it("should return correct full name for 'P'", function () {
          expect($scope.getAppointmentStateName('P')).toEqual('Pending');
        });

    });

});
