;
define([
    'angular',
    'common/settings',
    'angular-bootstrap'
], function (angular, settings) {

    var pagerDirective = function () {
        return {
            restrict: 'E',
            templateUrl: function (elem, attrs) {
                return settings.tpl_prefix + (attrs.templateUrl || '/directives/pager.html');
            },
            controller: ['$scope', '$attrs', '$parse', function ($scope, $attrs, $parse) {
                var scope = $scope.scope = $scope.scope || {};
                if ($attrs.pagerOptions) {
                    $scope.$parent.$watch($parse($attrs.pagerOptions), function(value) {
                        value.itemsPerPage = value.itemsPerPage || 20;
                        value.maxSize = value.maxSize || 20;
                        value.totalPages = parseInt((value.totalRecords / value.itemsPerPage));
                        if (value.totalRecords % value.itemsPerPage > 0) {
                            value.totalPages += 1;
                        }
                        scope.attrs = value;
                        scope.currentPage = value.page;
                        if (angular.isDefined(value.pagerChange)) {
                            pagerChange = value.pagerChange;
                        }
                    });
                }
                var pagerChange = null;
                if ($attrs.pagerChange) {
                    pagerChange = $scope.$parent.$eval($attrs.pagerChange);
                }
                scope.pagerChange = function () {
                    if (angular.isFunction(pagerChange)) {
                        pagerChange(scope.currentPage);
                    }
                };
                scope.pagerGoto = function () {
                    if (scope.goto > scope.attrs.total_pages) {
                        scope.goto = scope.attrs.total_pages;
                    }
                    scope.currentPage = scope.goto;
                    if (angular.isFunction(pagerChange)) {
                        pagerChange(scope.currentPage);
                    }
                };

            }],
            link: function ($scope, elem, attrs) {
            },
            scope: {
                pagerOptions: '=',
                pagerChange: '='
            }
        };
    };

    angular.module('amengsms.directives.pager', [
        'angular-growl',
        'amengsms.services.http'
    ]).directive('pager', [pagerDirective]);
});