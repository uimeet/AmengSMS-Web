;
(function (define) {

    define([
        'angular'
    ], function (angular, settings) {

        /**
         * 自定义参数,便于页面间传递参数
         * */
        var customParamsFactory = function ($rootScope,$state) {

            // 返回的对象
            var customParams = {};
            // 消息是否已读
            customParams.isGet = true;
            // 传递的数据
            customParams.data = [];
            // 设置消息的state name ,如 lobby.chart.gamesummary
            customParams.sates = '';

            /**
             * set 方法
             * @param data
             * @private
             */
            var _setter = function (data) {
                customParams.isGet = false;
                customParams.data = data;
                customParams.sates = $state.current.name;
            };

            /**
             * get 方法
             * @returns {{}}
             * @private
             */
            var _getter = function () {
                customParams.isGet = true;
                return customParams;
            };

            var _isGet = function () {
                return customParams.isGet;
            };

            return {
                isGet: _isGet,
                setter: _setter,
                getter: _getter
            }
        };

        angular.module('amengsms.lobby.factories.customParams', [
        ]).factory('customParams', ['$rootScope','$state', customParamsFactory]);
    });

})(define);