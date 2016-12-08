/************************************************************
 *    A ngResource service for fetching a list of doctors   *
 ************************************************************/

"use strict";

app.factory('DoctorsService', ['$resource', 'CONSTANTS', function($resource, CONSTANTS) {
    return {
        doctors: $resource(CONSTANTS.BASE_URL + '/icough/doctors/')
    }
}]);
