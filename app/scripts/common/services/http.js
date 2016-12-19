;
(function (define) {

    define([
        'angular',
        'angular-growl',
        'angular-cookies',
        'common/settings',
        'common/services/storage'
    ], function (angular) {
        var cancelRefresh = null;
        angular.module('amengsms.services.http', ['ngCookies', 'angular-growl', 'amengsms.settings', 'amengsms.services.storage']).config([
            '$httpProvider','settings',
            function($httpProvider, settings) {
                $httpProvider.defaults.transformRequest = function(request) {
                    if (typeof(request) != 'object') {
                        return request;
                    }
                    var str = [];
                    for (var k in request) {
                        if (k.charAt(0) == '$') {
                            delete request[k];
                            continue;
                        }
                        var v = 'object' == typeof(request[k]) ? JSON.stringify(request[k]) : request[k];
                        str.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
                    }
                    return str.join("&");
                };

                $httpProvider.defaults.timeout = 10000;
                $httpProvider.interceptors.push('myHttpInterceptor');
            }
        ]).factory('myHttpInterceptor', [
                '$rootScope',
                '$q',
                'storage',
            function($rootScope, $q, storage) {
                return {
                    request: function (config) {
                        if(config.method == 'POST'){
                            // post传参,更改application/json为application/x-www-form-urlencoded
                            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                        }
                        var ui = storage.getSession('userInfo');
                        if (ui) {
                            config.headers['Authorized-Key'] = ui.authorized_key;
                        }
                        config.withCredentials = true;
                        return config;
                    },
                    responseError: function(response) {
                        // do something on error
                        console.log('服务器端出错');
                        console.log(response);
                        response.data = {
                            code: -6,
                            message: response
                        };
                        return $q.reject(response);
                    }
                };
        }]).factory('$cc',['$http','settings','$timeout','$location', function($http, settings, $timeout, $location) {
            return {
                apiurl: function(url) {
                    // 整合url, 调用时只用写后的path即可,自动拼接host等组成完整url
                    return settings.api_prefix + url;
                },
                get: function(url) {
                    url = this.apiurl(url);
                    return $http.get(url);
                },
                post: function(url, param) {
                    url = this.apiurl(url);
                    return $http.post(url, param);
                },
                //监听请求条件的变化，可以间隔自动刷新列表
                watch: function(scope, timeout, change_search) {
                    if ('undefined' == typeof(change_search)) {
                        //是否改变url的querystring
                        change_search = false;
                    }
                    var success_cb = function(data) {};
                    var error_cb = function(data) {};
                    var cb = {
                        success: function(func) {
                            //设置成功的回调函数
                            success_cb = func;
                            return cb;
                        },
                        error: function(func) {
                            //设置失败的回调函数
                            error_cb = func;
                            return cb;
                        },
                        reload: function() {
                            run();
                        }
                    };

                    if (!scope.request) {
                        alert('watch 方法没有指定scope.request');
                        return;
                    }

                    if (!scope.request.url) {
                        alert('watch 方法没有指定scope.request.url');
                        return;
                    }

                    if (!scope.request.params) {
                        scope.request.params = {};
                    }

                    scope.request.reload = function() {
                        run();
                    };

                    var self = this;
                    var run = function() {
                        var url = self.apiurl(scope.request.url);
                        if (url.indexOf('?') == -1) {
                            url += '?' + $.param(scope.request.params)
                        } else {
                            url += '&' + $.param(scope.request.params)
                        }
                        $http.get(url).success(success_cb).error(error_cb);
                        if (change_search) {
                            $location.search(scope.request.params);
                        }
                    };
                    scope.$watch('request', run, true);

                    if (timeout) {
                        timeout = timeout * 1000;
                        //如果设置了timeout，会实时刷新
                        cancelRefresh = $timeout(function myFunction() {
                            run();
                            cancelRefresh = $timeout(myFunction, timeout);
                        }, timeout);

                        //切换到其他页面后，终止自动刷新
                        scope.$on('$destroy', function(e) {
                            $timeout.cancel(cancelRefresh);
                        });
                    }
                    return cb;
                }
            };
        }]);

    })

})(define);