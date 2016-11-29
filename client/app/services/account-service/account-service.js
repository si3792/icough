/***************************************************
 *    A ngResource service for account management. *
 ***************************************************/

"use strict";

app.factory('AccountService', function($resource, $q, CONSTANTS) {
    return {
        account: $resource(CONSTANTS.BASE_URL + '/account/'),
        password: $resource(CONSTANTS.BASE_URL + '/account/password/'),
        social: $resource(CONSTANTS.BASE_URL + '/account/social/'),
        history: $resource(CONSTANTS.BASE_URL + '/icough/history/'),
        appointments: $resource(CONSTANTS.BASE_URL + '/icough/appointments/:appId/', {
            appId: '@id'
        }, {
            'update': {
                method: 'PUT'
            }
        }),
        isDoctor: function() {
            var deferred = $q.defer();

            this.account.get({}, function(resp) {
                for (let group of resp.groups) {
                    if (group.name == 'doctors')
                        deferred.resolve(true);
                }
                deferred.resolve(false);
            }, function(resp) {
                deferred.reject();
            });

            return deferred.promise;
        }
    };
});
