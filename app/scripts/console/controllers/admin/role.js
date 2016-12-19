;
define([
    'angular',
    'angular-growl',
    'common/services/http',
    'common/factories/uibDialog'
], function (angular) {

    var adminRoleController = function ($rootScope, $scope, $http, growl, uibDialog) {
        var scope = $scope.scope = {};

        var init = function () {
            $rootScope.initLoader = $http.get('/role/all').success(function(response) {
                if (response.code == 0) {
                    scope.roles = response.data;
                } else {
                    growl.warning(response.message);
                }
            }).error(function (response) {
                growl.error('加载管理角色列表失败');
                console.log('Roll-ALL:', response);
            });
        };

        /***
         * 删除角色
         * @param roleId 角色内码
         */
        scope.deleteRole = function (role) {
            uibDialog.confirm('确定要删除「' + role.name + '」吗？', '删除角色', function (data) {
                data.isBusy = true;
                $http.post('/role/delete', { role_id: role.id }).success(function (response) {
                    data.isBusy = false;
                    data.modal.close();
                    if (response.code == 0) {
                        growl.success('角色删除成功');
                        init();
                    } else {
                        growl.warning(response.message);
                    }
                }).error(function (response) {
                    data.isBusy = false;
                    data.modal.close();

                    growl.error('删除角色失败，请刷新后重试');
                    console.log(response);
                });
            });
        };
        // 初始加载
        init();
    };

    angular.module('amengsms.console.controllers.adminRole', [
        'amengsms.services.http',
        'amengsms.factories.uibDialog',
        'angular-growl'
    ]).controller('amengsms.console.controllers.adminRole', [
        '$rootScope',
        '$scope',
        '$cc',
        'growl',
        'uibDialog',
        adminRoleController
    ]);

});