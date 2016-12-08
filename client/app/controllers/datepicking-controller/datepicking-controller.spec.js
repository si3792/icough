"use strict";

DEBUG = false; // Turn off console logs

describe("datepicking-controller", function() {

    var $rootScope, $controller;
    var $scope, controller;

    beforeEach(module('mainApp'));

    beforeEach(inject(function(_$rootScope_, _$controller_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
    }));

    describe("updateDatetime", function () {

      beforeEach(function(){
        $scope = $rootScope.$new();
        controller = $controller('DatepickingController', {
          '$scope': $scope
        });
      });

      it('should correctly update datetime', function(){

        $scope.$digest();
        $scope.date = new Date(2016, 12, 8, 1, 30, 0);
        $scope.time = new Date(2000, 10, 10, 2, 0, 1);
        $scope.updateDatetime();
        expect($scope.datetime).toEqual( new Date(2016, 12, 8, 2, 0, 1) );
      });

    });

});
