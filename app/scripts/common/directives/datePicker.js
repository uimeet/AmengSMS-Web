;
define([
    'angular',
    'angular-bootstrap'
], function (angular) {
    angular.module('amengsms.directives.datePicker', ['ui.bootstrap'])
        .directive('datePicker', function () {
            return {
                require: ['ngModel'],
                restrict: 'E',
                template: function (elem, attrs) {
                    var html = ['<input class="form-control" uib-datepicker-popup="yyyy-MM-dd"' +
                                ' is-open="authIsOpen" datepicker-options="{showWeeks:false}" show-button-bar="false" datepicker-append-to-body="true" ng-focus="autoIsOpen = true" ng-click="authIsOpen = true"' +
                                ' type="text" ng-model="ngModel" />'];
                    if (attrs.btnGroup == 'true') {
                        html.insert(0, '<span class="input-group">');
                        html.push('<span class="input-group-btn">' +
                            '<button type="button" class="btn btn-default" ng-click="authIsOpen = true">' +
                            '<i class="glyphicon glyphicon-calendar"></i>' +
                            '</button></span></span>');
                    }
                    return html.join('');
                },
                link: function ($scope, elem, attrs) {
                    $scope.autoIsOpen = false;

                    var $elem = angular.element('input', elem[0]);
                    if (attrs['inputClass']) {
                        $elem.addClass(attrs['inputClass']);
                    }
                    if (attrs['placeholder']) {
                        $elem.attr('placeholder', attrs['placeholder']);
                    }
                },
                scope: {
                    ngModel: '='
                }
            };
        });
});