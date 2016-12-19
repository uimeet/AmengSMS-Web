;
(function (define) {

    define([
        'angular',
        'angular-ui-router',
        'angular-growl',
        'angular-md5',
        'common/settings',
        'common/services/storage'
    ], function (angular) {

        angular.module('amengsms.services.authentication', [
            'ui.router',
            'angular-growl',
            'amengsms.settings',
            'angular-md5',
            'amengsms.services.storage'
        ]).factory('authentication', [
                '$rootScope',
                '$http',
                '$q',
                '$window',
                'md5',
                'settings',
                'storage',
                function ($rootScope, $http, $q, $window, md5, settings, storage) {
                    var self = this;
                    var init = function () {
                        var ui = storage.getLocal('userInfo');
                        if (ui) {
                            $rootScope.userInfo = ui;
                        }
                    };
                    /***
                     * 登录
                     * @param type 登录方式
                     * @param params 登录参数
                     */
                    var login = function (type, params) {
                        // 格式化参数
                        if (angular.isFunction(self[type + '_params'])) {
                            params = self[type + '_params'](params);
                        }
                        if (angular.isFunction(self[type])) {
                            return self[type](params)
                        }
                        return self.socialCallback(type, params);
                    };
                    self.weixin_params = function (params) {
                        if (!angular.isDefined(params.code)) {
                            return false;
                        }
                        return {
                            code: params.code,
                            state: params.state
                        };
                    };
                    /***
                     * 用户名密码登录方式
                     * @param userName
                     * @param password
                     * @param vercode
                     * @param remember
                     * @returns {Promise}
                     */
                    self.userPasswdCallback = function (params) {
                        // 默认不记住登录状态
                        remember = remember || false;
                        var deferred = $q.defer();
                        params.passwd = md5.createHash(md5.createHash(params.vercode.toUpperCase()) + md5.createHash(params.passwd));

                        $http.post(settings.api_prefix + '/user/login', params).then(function (result) {
                            if (result.data.code == 0) {
                                // 存入 sessionStorage
                                saveState(result.data.data);
                                deferred.resolve(result.data.data);
                            } else {
                                deferred.reject(result.data.message);
                            }
                        }, function (error) {
                            deferred.reject(error.message);
                        });

                        return deferred.promise;
                    };
                    /***
                     * 社交登录回调
                     * @param type 社交登录类型, weixin, qq, weibo
                     * @param params
                     */
                    self.socialCallback = function (type, params) {
                        var deferred = $q.defer();
                        if (params === false) {
                            deferred.reject('参数无效');
                        } else if ($.inArray(type, ['weixin', 'qq', 'weibo']) >= 0) {
                            $http.post(settings.api_prefix + '/user/login/' + type + '/callback', params)
                                .then(function (result) {
                                    if (result.data.code == 0) {
                                        saveState(result.data.data);
                                        deferred.resolve(result.data.data);
                                    } else {
                                        deferred.reject(result.data.message);
                                    }
                                }, function (error) {
                                    deferred.reject(error.message);
                                });
                        } else {
                            deferred.reject('登录类型无效');
                        }
                        return deferred.promise;
                    };
                    var isAuthorized = function () {
                        return $rootScope.userInfo != null;
                    };
                    // 退出
                    var logout = function () {
                        var deferred = $q.defer();
                        // 本地还有登录状态时,才执行该操作
                        if ($rootScope.userInfo) {
                            $http({
                                method: 'POST',
                                url: settings.api_prefix + '/user/logout',
                                headers: {
                                    "Authorized-Key": $rootScope.userInfo.authorized_key
                                }
                            }).then(function (result) {
                                if (result.data.code == 0) {
                                    clearSession();
                                    deferred.resolve(result.data);
                                } else {
                                    deferred.reject(result.data.message);
                                }

                            }, function (error) {
                                console.log(error);
                                deferred.reject(error);
                            });
                        }
                        return deferred.promise;
                    };
                    // 获取用户信息
                    var getUserInfo = function () {
                        return $rootScope.userInfo;
                    };

                    var clearSession = function () {
                        storage.removeLocal('userInfo');
                        $rootScope.userInfo = null;
                    };

                    var saveState = function (data) {
                        $rootScope.userInfo = angular.extend($rootScope.userInfo || {}, data);
                        storage.setLocal('userInfo', $rootScope.userInfo);
                    };


                    init();

                    return {
                        login: login,
                        getUserInfo: getUserInfo,
                        logout: logout,
                        isAuthorized: isAuthorized,
                        clearSession: clearSession,
                        saveState: saveState
                    };

                }]
            )
            .config(['$httpProvider', function ($httpProvider) {
                $httpProvider.interceptors.push('authHttpInterceptor');

            }])
            .factory('authHttpInterceptor', [
                '$rootScope',
                '$q',
                '$window',
                '$location',
                'growl',
                '$injector',
                'storage',
                function ($rootScope, $q, $window, $location, growl, $injector, storage) {
                    return {
                        request: function (config) {
                            config.headers = config.headers || {};
                            if ($rootScope.userInfo && $rootScope.userInfo.authorized_key) {
                                config.headers['Authorized-Key'] = $rootScope.userInfo.authorized_key;
                            }
                            return config;
                        },
                        response: function (response) {
                            if (response.data.code === 401) {
                                // 未登录
                                storage.removeLocal('userInfo');
                                $rootScope.userInfo = null;
                                // 提示错误
                                growl.error('登录超时或账号已在其它地方登录。');

                                // 回首页
                                $rootScope.$evalAsync(function () {
                                    $location.path('/login');
                                });
                            }

                            return response || $q.when(response);
                        }
                    }
                }]
            );

    });

})(define);