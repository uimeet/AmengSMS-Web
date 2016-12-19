define([
    'angular',
    'common/settings'
], function (angular) {

    var includeDirective = function (settings) {
        return {
            transclude: true,
            replace: true,
            templateUrl: function (element, attrs) {
                return settings.tpl_prefix + attrs.templateUrl;
            }
        }
    };

    angular.module('amengsms.directives.include', ['amengsms.settings'])
        .directive('include', ['settings', includeDirective]);
});