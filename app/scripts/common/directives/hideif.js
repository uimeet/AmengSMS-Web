define([
    'angular',
    'jQuery'
], function (angular) {

    var directive = function ($rootScope, $state) {
        return {
            link: function (scope, element, attrs) {
                var listener = function(event, toState, toParams, fromState, fromParams) {
                    if (toState.data && toState.data.hideElements) {
                        if ($.inArray(attrs['hideif'], toState.data.hideElements) >= 0) {
                            element.addClass('hide');
                        } else {
                            element.removeClass('hide');
                        }
                    } else {
                        element.removeClass('hide');
                    }
                };
                $rootScope.$on('$stateChangeStart', listener);
                // 主动调用一次，指令在个别情况下，刷新页面不会接受到$stateChangeStart事件
                listener(null, $state.current);
            }
        };
    };

    angular.module('amengsms.directives.hideif', [])
        .directive('hideif', ['$rootScope', '$state', directive]);
});