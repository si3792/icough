"use strict";

describe('DoctorsService', function() {

    var DoctorsService, $httpBackend, CONSTANTS;

    beforeEach(module('mainApp'));

    beforeEach(inject(function(_DoctorsService_, _$httpBackend_, _CONSTANTS_) {
        DoctorsService = _DoctorsService_;
        $httpBackend = _$httpBackend_;
        CONSTANTS = _CONSTANTS_;
    }));

    it('should fetch an array of doctors', function() {

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
        $httpBackend.expectGET(CONSTANTS.BASE_URL + '/icough/doctors/').respond(200, doctorsData);

        var data = DoctorsService.doctors.query();
        $httpBackend.flush();
        expect( angular.equals(data, doctorsData) ).toEqual(true);
    });
});
