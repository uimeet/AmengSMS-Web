;
define([
    'angular',
    'common/settings',
    'angular-bootstrap'
], function (angular, settings) {

    var promotionDirective = function () {
        return {
            restrict: 'E',
            templateUrl: function (elem, attrs) {
                return settings.tpl_prefix + (attrs.templateUrl || '/directives/promotion.html');
            },
            link: function ($scope, elem, attrs) {
            },
            scope: {
                promotionId: '=',
                maxCount: '=',
                coverCount: '=',
                delayTime: '=',
                addClass: '='
            },
            replace: false,
            transclude: true,
            controller: ['$scope', '$attrs', '$parse','$cc', '$timeout', function ($scope, $attrs, $parse, $http, $timeout) {
                var scope = $scope.scope = $scope.scope || {};
                scope.addClass = $attrs.addClass ? $attrs.addClass: '';
                var buildData = function (responseData) {
                    var max_count = parseInt($attrs.maxCount, 10);
                    var cover_count = parseInt($attrs.coverCount, 10);
                    var books = responseData.books;
                    var data_length = books.length;
                    scope.promotion_title = responseData.title;

                    scope.show_cover = (cover_count == 1);

                    if(data_length > 0){
                        if(cover_count == 1){
                            scope.cover = books[0];
                            var tmp = [];
                            for(var i=1; i < data_length; i++){
                                if(i < max_count){
                                    tmp.push(books[i]);
                                }
                            }
                            scope.books = tmp;
                        }else{
                            var tmp = [];
                            for(var i=0; i < data_length; i++){
                                if(i < max_count){
                                    tmp.push(books[i]);
                                }
                            }
                            scope.books = tmp;
                        }

                    }
                };
                if($attrs.promotionId && $attrs.maxCount && $attrs.coverCount){
                    var d_time = $attrs.delayTime? parseInt($attrs.delayTime, 10) : 0;
                    $timeout(function () {
                        scope.promotionLoader = $http.get('/book/get-promotion?promotion_id=' + $attrs.promotionId).success(function (response) {
                            if (response.code == 0) {
                                buildData(response.data);
                            }
                        });
                    }, d_time);

                }

            }]
        };
    };

    angular.module('amengsms.directives.promotion', [
        'angular-growl',
        'amengsms.services.http'
    ]).directive('promotion', [promotionDirective]);
});