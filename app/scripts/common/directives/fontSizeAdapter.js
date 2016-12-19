define([
    'angular'
], function (angular) {
    var directive = function ($rootScope) {
        return {
            link: function (scope, element, attrs) {
                var blx = {};
                // @ 页面参数的定义和计算
                blx.stdW = 375; // 以 iPhone 6 为基准宽度（同设计稿）
                blx._REM = 100; // 以 100 位基准字号（rem），方便计算
                blx.maxW = 768; // 宽度上限

                blx.docEl = document.documentElement;
                blx.docW = Math.min(blx.docEl.clientWidth,blx.docEl.clientHeight);
                blx.calW = (blx.docW < blx.maxW) ? blx.docW : blx.maxW;

                blx._REM = blx._REM * blx.calW / blx.stdW;

                blx._DPR = parseInt(window.devicePixelRatio)||1;
                blx._ORI = 'portrait';
                angular.element(window).on('orientationchange', function (event) {
                    switch (window.orientation){
                        //case 90:
                        case -90:
                            blx._ORI = 'landscape';
                            break;
                        default:
                            blx._ORI = 'portrait';
                            break;
                    }
                    element.attr('data-ori',blx._ORI);
                });
                element.attr({ 'data-dpr':blx._DPR, 'data-ori':blx._ORI }).css('font-size',blx._REM); // 标记页面参数
            }
        };
    };

    angular.module('amengsms.directives.fontSizeAdapter', [])
        .directive('fontSizeAdapter', ['$rootScope', directive]);
});