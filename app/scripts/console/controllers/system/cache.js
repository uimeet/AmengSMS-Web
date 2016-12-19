;
define([
    'angular',
    'angular-growl',
    'common/services/http',
    'common/factories/uibDialog'
], function (angular) {

    var controller = function ($scope, $http, growl, uibDialog) {
        var scope = $scope.scope = {};
        /**
         * 清除推荐列表的缓存
         */
        scope.clear = function (type, command) {
            uibDialog.confirm('确认清除' + type + '的缓存吗？', '清除确认', function (data) {
                data.isBusy = true;
                $http.post('/system/cache/clear/' + command).success(function (response) {
                    data.isBusy = false;
                    if (response.code == 0) {
                        data.modal.close();
                        growl.success('清除成功');
                        window.location.reload();
                    } else {
                        growl.warning(response.message);
                    }
                }).error(function (response) {
                    data.isBusy = false;
                    growl.error('操作失败，请刷新重试');
                    console.log(response);
                });
            });
        };

    };

    angular.module('amengsms.console.controllers.system.cache', [
        'amengsms.services.http',
        'amengsms.factories.uibDialog',
        'angular-growl'
    ]).controller('amengsms.console.controllers.system.cache', [
        '$scope',
        '$cc',
        'growl',
        'uibDialog',
        controller
    ]);

});