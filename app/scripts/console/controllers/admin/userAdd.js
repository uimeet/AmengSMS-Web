;
define([
    'angular',
    'angular-growl',
    'common/services/http'
], function (angular) {

    var controller = function ($rootScope, $scope, $state, $stateParams, $http, growl) {
        var scope = $scope.scope = {
            isBusy: false,
            role: { }
        };

        // 管理用户内码，仅处于编辑状态时可用
        var adminId = angular.isDefined($stateParams.adminId) ? parseInt($stateParams.adminId) : 0;
        // 页面初始化方法
        if (adminId > 0) {
            $rootScope.initLoader = $http.get('/admin/get?admin_id=' + adminId)
                .success(function (response) {
                    if (response.code == 0) {
                        angular.extend(scope, response.data);
                    } else {
                        growl.error(response.message);
                    }
                })
                .error(function (response) {
                    console.log(response);
                });
        } else {
            $rootScope.initLoader = $http.get('/role/all')
                .success(function (response) {
                    if (response.code == 0) {
                        scope.roles = response.data;
                    } else {
                        growl.error(response.message);
                    }
                })
                .error(function (response) {
                    console.log(response);
                });
        }

        // 表单提交
        scope.submit = function ($event) {
            var payload = angular.extend({ role_ids: [], admin_id: adminId }, scope.admin);
            angular.forEach(scope.roles, function (role) {
                if (role.actived) {
                    payload.role_ids.push(role.id);
                }
            });

            scope.isBusy = true;
            $http.post('/admin/save', payload).success(function (response) {
                scope.isBusy = false;
                if (response.code == 0) {
                    growl.success('管理用户保存成功');
                    $state.go('console.admin.user');
                } else {
                    growl.error(response.message);
                }
            }).error(function () {
                scope.isBusy = false;
                growl.error('保存出错，请刷新重试');
            })
        };
    };

    angular.module('amengsms.console.controllers.adminUserAdd', [
        'amengsms.services.http',
        'angular-growl'
    ]).controller('amengsms.console.controllers.adminUserAdd', [
        '$rootScope',
        '$scope',
        '$state',
        '$stateParams',
        '$cc',
        'growl',
        controller
    ]);

});