;
define([
    'angular',
    'angular-growl',
    'common/services/http',
    'common/factories/uibDialog'
], function (angular) {

    var controller = function ($rootScope, $scope, $http, growl, uibDialog) {
        var scope = $scope.scope = {  };
        var currentPage = 1;
        var currentStatus = 0;

        scope.query = function (page, status, iscope) {
            currentPage = page || 1;
            currentStatus = status || 0;
            iscope = iscope || $rootScope;
            iscope.initLoader = $http.get('/task/query?page=' + currentPage + '&status=' + currentStatus)
                .success(function (response) {
                    scope.tasks = [false, false, false];
                    if (response.code == 0) {
                        scope.tasks[currentStatus] = response.data.records;
                        // 删除掉记录属性
                        delete response.data.records;
                        scope.pager = response.data;
                    } else {
                        console.log('Task: ', response.code, response.message);
                    }
                }).error(function (response) {
                    console.log(response);
                    growl.error('读取任务记录失败');
                });
        };

        /***
         * 翻页
         * @param page
         */
        scope.pagerChange = function (page) {
            scope.query(page, currentStatus, scope);
        };

        var reload = function () {
            scope.query(currentPage, currentStatus, scope);
        };

        /***
         * 激活给定任务
         * @param task
         */
        scope.active = function (task) {
            if (task.status.value != 2) {
                growl.warning('只有执行失败的任务才能被重新激活');
                return false;
            }
            uibDialog.confirm('确定要重新激活此任务(任务# ' + task.id + ')吗？<br />（若引起失败的原因未解决，重新执行仍然会失败）', '激活确认', function (data) {
                data.isBusy = true;
                $http.post('/task/reactive', { task_id: task.id }).success(function (response) {
                    data.isBusy = false;
                    if (response.code == 0) {
                        reload();
                        growl.success('任务激活成功');
                        data.modal.close();
                    } else {
                        growl.warning(response.message);
                    }
                }).error(function (response) {
                    data.isBusy = false;
                    console.log(response);
                    growl.error('任务激活失败，请稍候重试');
                });
            });
        };

        /***
         * 查看任务详情
         * @param task
         */
        scope.detail = function (task) {
            $rootScope.initLoader = $http.get('/task/detail?task_id=' + task.id).success(function (response) {
                if (response.code == 0) {
                    uibDialog.openTemplateUrl(response.data, '/task/detail.html');
                } else {
                    growl.warning(response.message);
                }
            }).error(function (response) {
                console.log(response);
                growl.error('获取任务详情失败');
            })
        };

    };

    angular.module('amengsms.console.controllers.task.task', [
        'amengsms.services.http',
        'amengsms.factories.uibDialog',
        'angular-growl'
    ]).controller('amengsms.console.controllers.task.task', [
        '$rootScope',
        '$scope',
        '$cc',
        'growl',
        'uibDialog',
        controller
    ]);

});