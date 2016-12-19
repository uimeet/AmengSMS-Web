;
define([
    'angular',
    'angular-bootstrap',
    'common/settings',
    'common/filter'
], function (angular) {

    /**
     * uibModal 封装接口
     *
     * */
    var uibDialogFactory = function ($rootScope, $uibModal, settings, $filter) {
        var index = 0;
        // 默认选项
        var defaults = {
            animation: true,
            templateUrl: settings.tpl_prefix + '/bootstrap/dialog.html',
            windowTemplateUrl: settings.tpl_prefix + '/bootstrap/window.html',
            controller: ['$scope', '$uibModalInstance', 'data', function ($scope, $uibModalInstance, data) {
                // 持有实例
                data.modal = $uibModalInstance;
                // 客户传进来的值
                $scope.data = data;
                $scope.settings = settings;
                $scope.index = index;
                // 点击确认按钮的事件
                $scope.confirm = function (data) {
                    data.button_type = 'ok';
                    // 如果外部提供了确认回调, 执行外部的确认回调
                    if (angular.isFunction(data.onConfirm)) {
                        data.onConfirm(data);
                    } else {
                        $uibModalInstance.close(data);
                    }
                };
                // 点击取消按钮的事件
                $scope.cancel = function () {
                    data.button_type = 'cancel';
                    $uibModalInstance.dismiss(data);
                };
            }],
            size: null,
            resolve: null,
            windowClass: 'm_Window',
            backdrop: true

        };
        var dialog = {};
        /**
         * 最原始的封装, 打开一个模态窗口
         *
         * @param data {object} 传递到视图的数据对象
         * @param options {object} $uibModal的选项, 请参见文档
         * */
        dialog.open = function (data, options) {
            index ++;
            var opts = angular.extend({}, defaults, options || {});
            opts.resolve = {
                data: function () {
                    return data;
                }
            };
            return $uibModal.open(opts);
        };
        /**
         * 指定模板, 打开一个模态窗口
         * @param data {object} 传递到视图的数据对象
         * @param templateUrl {string} 相当于 settings.tpl_prefix 的模板路径, 该模板
         *                              替换的是整个模态窗口模板,而不是body
         * */
        dialog.openTemplateUrl = function (data, templateUrl) {
            var opts = angular.extend({}, defaults, { templateUrl: settings.tpl_prefix + templateUrl });
            return dialog.open(data, opts);
        };

        /**
         * 打开对话框url，只覆盖body部分
         * @param data
         * @param templateUrl
         */
        dialog.openSimpleTemplateUrl = function (data, templateUrl, options) {
            data.templateUrl = templateUrl;
            if(typeof data.showCancelButton == 'undefined'){
                data.showCancelButton = true;
            }
            if(typeof data.showOKButton == 'undefined'){
                data.showOKButton = true;
            }
            if(typeof data.showHead == 'undefined'){
                data.showHead = true;
            }
            var opts = angular.extend({}, defaults, options);
            return dialog.open(data, opts);
        };
        /**
         * 封装的警告框
         * */
        dialog.alert = function (body, title, cfg){
            title = title || '提示';
            var conf = angular.extend({
                title: title,
                body: $filter('trust_html')(body),
                showCancelButton: false,
                showOKButton: true,
                showHead: true,
                iconClass: 'excl'
            }, cfg,{});
            return dialog.open(conf,{
                windowClass: 'm_Dialog'
            });
        };
        /**
         * 封装的确认框
         * */
        dialog.confirm = function (body, title, onConfirm) {
            title = title || '确认';
            onConfirm = onConfirm || false;
            return dialog.open({
                title: title,
                body: $filter('trust_html')(body),
                showCancelButton: true,
                showOKButton: true,
                showHead: true,
                onConfirm: onConfirm,
                iconClass: 'exclamation-circle'
            }, {
                windowClass: 'm_Dialog'
            });
        };
        /**
         * 弹出层,并带html显示
         * @param body
         * @param title
         */
        dialog.confirmWithHtml = function (body, title) {
            title = title || '确认';
            return dialog.open({
                title: $filter('trust_html')(title),
                template: $filter('trust_html')(body),
                showCancelButton: true,
                showOKButton: true,
                showHead: true,
                iconClass: 'exclamation-circle'
            }, {
                windowClass: 'm_Dialog'
            });
        };
        /**
         * 封装的成功提示
         * */
        dialog.success = function (body, title) {
            return dialog.open({
                title: title || '操作成功',
                body: $filter('trust_html')(body),
                showCancelButton: false,
                showOKButton: true,
                showHead: true,
                iconClass: 'tick'
            }, {
                windowClass: 'm_Dialog'
            });
        };
        /**
         * 封装的失败提示
         * */
        dialog.fail = function (body, title) {
            return dialog.open({
                title: title || '操作失败',
                body: $filter('trust_html')(body),
                showCancelButton: false,
                showOKButton: true,
                showHead: true,
                iconClass: 'cross'
            }, {
                windowClass: 'm_Dialog'
            });
        };
        return dialog;
    };

    angular.module('amengsms.factories.uibDialog', ['ui.bootstrap', 'amengsms.settings', 'amengsms.filter'])
        .factory('uibDialog', ['$rootScope', '$uibModal', 'settings', '$filter', uibDialogFactory]);

});