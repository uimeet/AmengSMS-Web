define([
    'angular'
], function (angular) {

    var wrapperClassesDirective = function ($rootScope) {
        return {
            link: function (scope, element, attrs) {
                var listener = function(event, toState, toParams, fromState, fromParams) {
                    var cls = '';
                    if (toState.data && toState.data.wrapperClass) {
                        cls += toState.data.wrapperClass;
                    }
                    element.attr('class', cls);
                };
                $rootScope.$on('$stateChangeStart', listener);
            }
        };
    };

    angular.module('amengsms.directives.wrapperClasses', [])
        .directive('wrapperClasses', ['$rootScope', wrapperClassesDirective]);
});