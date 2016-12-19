;
define([
    'angular',
    'angular-growl',
    'common/services/http',
    'common/factories/uibDialog'
], function (angular) {

    var controller = function ($rootScope, $scope, $http, growl, uibDialog) {
        var scope = $scope.scope = {};
        var currentPage = 1;

        var init = function () {
            query(1, $rootScope);
        };
        var query = function (page, iscope) {
            currentPage = page || currentPage;
            iscope = iscope || scope;
            iscope.initLoader = $http.get('/admin/query?page=' + currentPage).success(function (response) {
                scope.admins = response.data;
            }).error(function (response) {
                console.log(response);
                growl.error('读取管理用户记录失败');
            });
        };
        /***
         * 删除管理员
         * @param admin
         */
        scope.deleteAdmin = function (admin) {
            uibDialog.confirm('删除操作不可逆，确定要删除「' + admin.login_name + '」吗？', '删除确认', function (data) {
                data.isBusy = true;
                $http.post('/admin/delete', { admin_id: admin.id }).success(function (response) {
                    data.isBusy = false;
                    data.modal.close();
                    if (response.code == 0) {
                        query();
                        growl.success('管理用户删除成功');
                    } else {
                        growl.warning(response.message);
                    }
                }).error(function () {
                    growl.error('删除失败，请刷新重试');
                    data.isBusy = false;
                });
            });
        };
        /***
         * 锁定管理员
         * @param admin
         */
        scope.lockAdmin = function (admin) {
            uibDialog.confirm('锁定用户后，该用户将不能登录，确定锁定「' + admin.login_name + '」吗？', '锁定确认', function (data) {
                data.isBusy = true;
                $http.post('/admin/lock', { admin_id: admin.id }).success(function (response) {
                    data.isBusy = false;
                    data.modal.close();
                    if (response.code == 0) {
                        query();
                        growl.success('管理用户锁定成功');
                    } else {
                        growl.warning(response.message);
                    }
                }).error(function () {
                    growl.error('操作失败，请刷新重试');
                    data.isBusy = false;
                });
            });
        };
        /***
         * 解锁管理员
         * @param admin
         */
        scope.unlockAdmin = function (admin) {
            uibDialog.confirm('确定要解锁「' + admin.login_name + '」吗？', '解锁确认', function (data) {
                data.isBusy = true;
                $http.post('/admin/unlock', { admin_id: admin.id }).success(function (response) {
                    data.isBusy = false;
                    data.modal.close();
                    if (response.code == 0) {
                        query();
                        growl.success('管理用户解锁成功');
                    } else {
                        growl.warning(response.message);
                    }
                }).error(function () {
                    growl.error('操作失败，请刷新重试');
                    data.isBusy = false;
                });
            });
        };

        /***
         * 翻页
         * @param page
         */
        scope.pagerChange = function (page) {
            query(page);
        };

        init();
    };

    angular.module('amengsms.console.controllers.adminUser', [
        'amengsms.services.http',
        'amengsms.factories.uibDialog',
        'angular-growl'
    ]).controller('amengsms.console.controllers.adminUser', [
        '$rootScope',
        '$scope',
        '$cc',
        'growl',
        'uibDialog',
        controller
    ]);

});