;
(function (define) {

    define([
        'angular',
        'angular-w5c-validator'
    ], function (angular) {
        angular.module('w5c.validator')
            .directive('w5cRemoteCheck', ['$timeout', '$http', 'w5cValidator', function ($timeout, $http, w5cValidator) {
                return {
                    require: ["ngModel", "?^w5cFormValidate", "?^form"],
                    link: function (scope, elem, attrs, ctrls) {
                        var ngModelCtrl = ctrls[0], w5cFormCtrl = ctrls[1], formCtrl = ctrls[2];

                        var doValidate = function () {
                            var attValues = scope.$eval(attrs.w5cRemoteCheck);
                            var url = attValues.url;
                            if (url.indexOf('?') == -1) {

                            }
                            $http.get(url).success(function (data) {
                                var state = data.code == 0;
                                ngModelCtrl.$setValidity('w5cremotecheck', state);
                                if (!state) {
                                    w5cValidator.showError(elem[0], [data.message], w5cFormCtrl.options);
                                    if (formCtrl[elem[0].name]) {
                                        formCtrl[elem[0].name].w5cError = true;
                                    }
                                    if (!formCtrl.$errors) {
                                        formCtrl.$errors = [data.message];
                                    } else {
                                        formCtrl.$errors.unshift(data.message);
                                    }
                                } else if (angular.isFunction(attValues.callback)) {
                                    attValues.callback(data);
                                }
                            });
                        };

                        ngModelCtrl.$viewChangeListeners.push(function () {
                            formCtrl.$errors = [];
                            ngModelCtrl.$setValidity('w5cremotecheck', true);
                            if (ngModelCtrl.$invalid && !ngModelCtrl.$error.w5cremotecheck) {
                                return;
                            }
                            if (ngModelCtrl.$dirty) {
                                doValidate();
                            }
                        });

                        var firstValue = scope.$eval(attrs.ngModel);
                        if (firstValue) {
                            if (ngModelCtrl.$invalid && !ngModelCtrl.$error.w5cremotecheck) {
                                return;
                            }
                            doValidate();
                        }

                        var associate = ctrls[2][attrs.associate];
                        associate && associate.$viewChangeListeners.push(function () {
                            if (ngModelCtrl.$invalid && !ngModelCtrl.$error.w5cremotecheck) {
                                return;
                            }
                            doValidate();
                        });
                    }
                };
            }]);
    });

})(define);