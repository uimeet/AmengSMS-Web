;
(function (define) {

    define([
        'angular',
        'common/directives/include',
        'common/directives/pageTitle',
        'common/directives/wrapperClasses',
        'common/directives/formValidator',
        'common/directives/datePicker',
        'common/directives/pager',
        'common/directives/fontSizeAdapter',
        'common/directives/hideif',
        'common/directives/promotion',
        'common/directives/swipeMenu'
    ], function(angular) {
        angular.module(
            'amengsms.directives', [
                'amengsms.directives.include',
                'amengsms.directives.pageTitle',
                'amengsms.directives.wrapperClasses',
                'amengsms.directives.datePicker',
                'amengsms.directives.pager',
                'amengsms.directives.fontSizeAdapter',
                'amengsms.directives.hideif',
                'amengsms.directives.promotion',
                'amengsms.directives.swipeMenu'
            ]);
    });


})(define);