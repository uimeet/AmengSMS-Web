;
define([
    'angular',
    'angular-w5c-validator',
    'angular-growl',
    'console/settings',
    'common/services/http',
    'common/services/authentication'
], function (angular) {
    var loginController = function ($scope, $http, $state, growl, settings, authentication) {
        // 验证码相关
        $scope.verimage = settings.api_prefix + '/verimage?rnd=' + Math.random();
        $scope.change_verimage = function () {
            $scope.verimage = settings.api_prefix + '/verimage?rnd=' + Math.random();
        };

        var vm = $scope.vm = {
            htmlSource        : "",
            showErrorType     : "1",
            showDynamicElement: true,
            dynamicName       : "dynamicName",
            entity            : {},
            isBusy            : false
        };
        // 登录提交
        vm.login = function ($event) {
            // 保证未提交过
            if (!vm.isBusy) {
                authentication.login('userPasswdCallback', {
                    name: vm.entity.name,
                    passwd: vm.entity.passwd,
                    vercode: vm.entity.vercode,
                    remember: vm.entity.remember
                }).then(function (result) {
                    growl.success('登录成功');
                    // 登录成功后跳转到仪表盘
                    $state.go('console.dashboard');
                }, function (result) {
                    // 出错后变更验证码
                    $scope.change_verimage();
                    vm.isBusy = false;
                    if (result) {
                        growl.error(result);
                    } else {
                        growl.error('登录出错，请稍候重试');
                    }
                    if ($event.currentTarget) {
                        angular.element($event.currentTarget.parentNode).trigger('reset');
                    }
                });

                vm.isBusy = true;
            }
        };
    };

    angular.module('amengsms.console.controllers.login', [
        'w5c.validator',
        'angular-growl',
        'amengsms.settings',
        'amengsms.services.http',
        'amengsms.services.authentication'
    ]).controller('amengsms.console.controllers.login', [
        '$scope',
        '$cc',
        '$state',
        'growl',
        'settings',
        'authentication',
        loginController
    ])
});