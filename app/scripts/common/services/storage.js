;
(function (define) {

    define(['angular'], function (angular) {

        function StorageService($window) {

            this.getSession = function (key) {
                return this.get($window.sessionStorage, key);
            };
            this.setSession = function (key, value) {
                return this.set($window.sessionStorage, key, value);
            };
            this.removeSession = function (key) {
                return $window.sessionStorage.removeItem(key);
            };
            this.getLocal = function (key) {
                return this.get($window.localStorage, key);
            };
            this.setLocal = function (key, value) {
                return this.set($window.localStorage, key, value);
            };
            this.removeLocal = function (key) {
                return $window.localStorage.removeItem(key);
            };

            this.get = function (backend, key) {
                var value = backend[key];
                if (value) {
                    try {
                        return JSON.parse(value);
                    } catch(err) {
                    }
                }
                return null;
            };
            this.set = function (backend, key, value) {
                backend[key] = JSON.stringify(value);
                return value;
            };

        };
        angular.module('amengsms.services.storage', [])
            .service('storage', ['$window', StorageService]);

    });

})(define);