define([
    'angular',
    'common/settings'
], function (angular) {

    var pageTitleDirective = function ($rootScope, $timeout, settings) {
        return {
            link: function(scope, element, attrs) {
                var listener = function(event, toState, toParams, fromState, fromParams) {
                    // 默认title
                    var title = settings.site_name;
                    if (toState.data && toState.data.pageTitle) {
                        title = settings.site_name + ' | ' + toState.data.pageTitle;
                    }
                    element.text(title);
                };
                $rootScope.$on('$stateChangeStart', listener);
            }
        };
    };

    angular.module('amengsms.directives.pageTitle', ['amengsms.settings'])
        .directive('pageTitle', ['$rootScope', '$timeout', 'settings', pageTitleDirective]);
});