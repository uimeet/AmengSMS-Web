;
define([
    'angular',
    'angular-growl',
    'common/services/http'
], function (angular) {

    var adminRoleAddController = function ($rootScope, $scope, $state, $stateParams, $http, growl) {
        var scope = $scope.scope = {
            isBusy: false,
            role: { }
        };
        // 角色内码，仅处于编辑状态时可用
        var roleId = angular.isDefined($stateParams.roleId) ? parseInt($stateParams.roleId) : 0;
        // 页面初始化方法
        if (roleId > 0) {
            $rootScope.initLoader = $http.get('/role/get?role_id=' + roleId)
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
            $rootScope.initLoader = $http.get('/function/all')
                .success(function (response) {
                    if (response.code == 0) {
                        scope.functions = response.data;
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
            var funcIds = [];
            angular.forEach(scope.functions, function (funcType) {
                angular.forEach(funcType.children, function (func) {
                    if (func.actived === true) {
                        funcIds.push(func.id);
                    }
                })
            });
            scope.isBusy = true;
            $http.post('/role/save', { name: scope.role.name, func_ids: funcIds, role_id: roleId }).success(function (response) {
                scope.isBusy = false;
                if (response.code == 0) {
                    growl.success('角色保存成功');
                    $state.go('console.admin.role');
                } else {
                    growl.error(response.message);
                }
            }).error(function () {
                scope.isBusy = false;
                growl.error('保存出错，请刷新重试');
            })
        };
    };

    angular.module('amengsms.console.controllers.adminRoleAdd', [
        'amengsms.services.http',
        'angular-growl'
    ]).controller('amengsms.console.controllers.adminRoleAdd', [
        '$rootScope',
        '$scope',
        '$state',
        '$stateParams',
        '$cc',
        'growl',
        adminRoleAddController
    ]);

});