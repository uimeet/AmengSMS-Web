/**
 * 公用的组件方法
 * */


(function (define) {

    /**
     * 公用组件的通用配置
     * */

    define([
        'angular',
        'common/factories/uibDialog',
        'common/factories/utils'
    ], function (angular) {
        angular
            .module('amengsms.factories', [
                'amengsms.factories.uibDialog',
                'amengsms.factories.utils'
            ]);
    });

})(define);