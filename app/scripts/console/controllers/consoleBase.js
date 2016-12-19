;
define([
    'angular',
    'angular-growl',
    'common/services/http',
    'common/services/authentication',
    'common/factories/uibDialog'
], function (angular) {

    var consoleBaseController = function ($rootScope, $scope, $http, $state, growl, uibDialog, authentication) {
        var scope = $scope.scope = {};
        // 初始化数据
        $rootScope.initLoader = $http.get('/show-menu').success(function (response) {
            if (response.code == 0) {
                scope.menus = response.data;
            } else {
                growl.error(response.message);
            }
        }).error(function (response) {
            growl.error(response.message);
        });
        $rootScope.logout = function () {
            uibDialog.confirm('确定要退出登录吗？', '退出确认', function (data) {
                data.isBusy = true;
                authentication.logout().then(function () {
                    data.isBusy = false;
                    data.modal.close();
                    growl.success('退出成功');
                    $state.go('login');
                }, function (message) {
                    data.isBusy = false;
                    if (typeof(message) == 'string') {
                        growl.error(message);
                    } else {
                        growl.error('操作失败，请刷新重试');
                    }
                });
            });
        };

    };

    angular.module('amengsms.console.controllers.consoleBase', [
        'amengsms.services.http',
        'amengsms.services.authentication',
        'amengsms.factories.uibDialog',
        'angular-growl'
    ]).controller('amengsms.console.controllers.consoleBase', [
        '$rootScope',
        '$scope',
        '$cc',
        '$state',
        'growl',
        'uibDialog',
        'authentication',
        consoleBaseController
    ]);

});