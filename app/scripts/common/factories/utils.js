;
define([
    'angular',
    'angular-md5',
    'common/settings'
], function (angular) {

    var utilsFactory = function ($settings, md5) {
        var utils = {};
        utils.UTF8Encode = function(string) {
            string = string.replace(/\x0d\x0a/g, "\x0a");
            var output = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    output += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    output += String.fromCharCode((c >> 6) | 192);
                    output += String.fromCharCode((c & 63) | 128);
                } else {
                    output += String.fromCharCode((c >> 12) | 224);
                    output += String.fromCharCode(((c >> 6) & 63) | 128);
                    output += String.fromCharCode((c & 63) | 128);
                }
            }
            return output;
        };
        utils.md5 = function (string) {
            string = utils.UTF8Encode(string);
            return md5.createHash(string);
        };


        var request_image = function (url) {
            return $.when(function() {
                var def = $.Deferred();
                var img = new Image();
                img.onload = function() { def.resolve(img); };
                img.onerror = function() { def.reject(url); };
                img.src = url + '?random-no-cache=' + Math.floor((1 + Math.random()) * 0x10000).toString(16);

                return def.promise();
            }());
        };

        utils.ping = function (url, multiplier, params) {
            return $.when(function() {
                var def = $.Deferred();
                var start = (new Date()).getTime();

                request_image(url).then(function() {
                            var delta = ((new Date()).getTime() - start);
                            delta *= (multiplier || 1);
                            def.resolve(delta, params);
                        }, function () {
                            def.reject('Error', params);
                        }
                );
                setTimeout(function() { def.reject('Timeout', params); }, 10000);

                return def.promise();
            }());
        };
        return utils;

    };

    angular.module('amengsms.factories.utils', ['amengsms.settings'])
        .factory('utils', ['settings', 'md5', utilsFactory]);
});