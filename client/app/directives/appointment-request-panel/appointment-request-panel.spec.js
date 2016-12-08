"use strict";

DEBUG = false; // Turn off console logs

describe("cd-appointment-request-panel", function() {

    var $location, $rootScope, $compile, $q;
    var $scope;
    var compiledElement, element;

    function mockDoctorsService() {}

    function mockAccountService() {}

    function mockAlertModalService() {}

    beforeEach(module('mainApp', function($provide) {
        $provide.service('DoctorsService', mockDoctorsService);
        $provide.service('AccountService', mockAccountService);
        $provide.service('AlertModalService', mockAlertModalService);
    }));

    beforeEach(module('templates'));

    beforeEach(inject(function(_$location_, _$rootScope_, _$compile_, _$q_) {
        $location = _$location_;
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $q = _$q_;
    }));

    beforeEach(function() {
        element = angular.element('<cd-appointment-request-panel></cd-appointment-request-panel>');
        $scope = $rootScope.$new();
        compiledElement = $compile(element)($scope);
    });

    it("should populate $scope.doctors", function() {

        var doctorsData = [{
            "id": 1,
            "first_name": "Gregory",
            "last_name": "House",
            "username": "ghouse"
        }, {
            "id": 2,
            "first_name": "Eric",
            "last_name": "Foreman",
            "username": "eforeman"
        }];

        mockDoctorsService.prototype.doctors = {};
        mockDoctorsService.prototype.doctors.query = function() {
            return doctorsData;
        }

        mockAccountService.prototype.isDoctor = function() {
            var deferred = $q.defer();

            deferred.resolve(false);
            return deferred.promise;
        };

        $scope.$digest();
        expect($scope.doctors).toEqual(doctorsData);

    });

    it("should correctly set $scope.isDoctor", function () {

      mockAccountService.prototype.isDoctor = function() {
          var deferred = $q.defer();

          deferred.resolve(false);
          return deferred.promise;
      };

      mockDoctorsService.prototype.doctors = {};
      mockDoctorsService.prototype.doctors.query = function() {
          return [];
      }

      $scope.$digest();
      expect($scope.isDoctor).toEqual(false);

    });

    it("should correctly set $scope.isDoctor (2)", function () {

      mockAccountService.prototype.isDoctor = function() {
          var deferred = $q.defer();

          deferred.resolve(true);
          return deferred.promise;
      };

      mockDoctorsService.prototype.doctors = {};
      mockDoctorsService.prototype.doctors.query = function() {
          return [];
      }

      $scope.$digest();
      expect($scope.isDoctor).toEqual(true);

    });

    it("should be hidden for doctors", function () {

      mockAccountService.prototype.isDoctor = function() {
          var deferred = $q.defer();

          deferred.resolve(true);
          return deferred.promise;
      };

      mockDoctorsService.prototype.doctors = {};
      mockDoctorsService.prototype.doctors.query = function() {
          return [];
      }

      $scope.$digest();
      expect(element.find('#appointment-request-panel-root').hasClass('ng-hide')).toBe(true);
    });

    it("should be visible for patients", function () {

      mockAccountService.prototype.isDoctor = function() {
          var deferred = $q.defer();

          deferred.resolve(false);
          return deferred.promise;
      };

      mockDoctorsService.prototype.doctors = {};
      mockDoctorsService.prototype.doctors.query = function() {
          return [];
      }

      $scope.$digest();
      expect(element.find('#appointment-request-panel-root').hasClass('ng-hide')).toBe(false);
    });


    describe("requestAppointment", function () {

      it("should successfully request appointment", function () {

        mockAccountService.prototype.appointments = {};
        mockAccountService.prototype.appointments.save = function(opt, opt2, callback, errorCallback) {
          callback();
        };

        mockAlertModalService.prototype.alert = function(title, text, type) {
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        };

        spyOn(mockAlertModalService.prototype, 'alert').and.callThrough();
        spyOn(mockAccountService.prototype.appointments, 'save').and.callThrough();

        $scope.$digest();
        $scope.datetime = new Date(2030, 11, 11, 11, 11, 11);
        $scope.doctor = {
            "id": 1,
            "first_name": "Gregory",
            "last_name": "House",
            "username": "ghouse"
        };
        $scope.requestAppointment();
        $scope.$digest();
        expect($location.path()).toEqual('/home');
        expect(mockAlertModalService.prototype.alert).toHaveBeenCalled();
        expect(mockAccountService.prototype.appointments.save).toHaveBeenCalled();
      });

      it("should display a message in case of an error", function () {

        mockAccountService.prototype.appointments = {};
        mockAccountService.prototype.appointments.save = function(opt, opt2, callback, errorCallback) {
          errorCallback({
            'data': {
              'message': 'Invalid appointment time'
            }
          });
        };

        mockAlertModalService.prototype.alert = function(title, text, type) {
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        };

        spyOn(mockAlertModalService.prototype, 'alert').and.callThrough();
        spyOn(mockAccountService.prototype.appointments, 'save').and.callThrough();

        $scope.$digest();
        $scope.datetime = new Date(2000, 11, 11, 11, 11, 11);
        $scope.doctor = {
            "id": 1,
            "first_name": "Gregory",
            "last_name": "House",
            "username": "ghouse"
        };
        $scope.requestAppointment();
        $scope.$digest();
        expect(mockAlertModalService.prototype.alert).toHaveBeenCalledWith('Error', 'Invalid appointment time', 'danger');
        expect(mockAccountService.prototype.appointments.save).toHaveBeenCalled();
      });

    });

});
