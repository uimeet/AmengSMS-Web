;
define([
    'angular',
    'angular-touch'
], function (angular) {
    angular.module('amengsms.directives.swipeMenu', ['ngTouch'])
    .directive('swipeMenu', ['$swipe', '$document', '$rootScope', '$parse', function ($swipe, $document, $rootScope, $parse) {
        return {
            restrict: 'A',
            link: function (scope, $elem, attrs) {
                var startCoords, dir, endCoords, lastCoords,

                    // 最小需要水平移动距离
                    tolerance = 10,

                    // 是否华东必须超过 tolerance 才激活菜单划入效果
                    toleranceMet = false,

                    // 向指定方向滑动达到此距离后停止滑动，自动完成打开
                    slideTolerance = 50,

                    // 允许的滑动角度偏差，传给 ngTouch 用的
                    moveYBufferRadius = 30,

                    // 整个滑动过程中各个节点追加的样式
                    transitionClass = 'swipe-menu-transition',
                    openClass = 'swipe-menu-open',
                    isSlidingClass = 'swipe-menu-is-sliding',

                    // TODO: 菜单的宽度，可在 attrs 中指定
                    // var menuWidth = $document[0].width - 74;
                    // angular.element(document).find('head').append('<style type="text/css">@charset "UTF-8";.slider.open{-webkit-transform: translate3d(' + menuWidth + 'px, 0, 0);</style>');
                    menuWidth = 100,
                    // 方向（rightToLeft | leftToRight）
                    direction = 'leftToRight',

                    // 适配 http://davidwalsh.name/vendor-prefix
                    prefix = (function () {
                        var styles = window.getComputedStyle(document.documentElement, ''),
                            pre = (Array.prototype.slice
                                .call(styles)
                                .join('')
                                .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
                            )[1];
                        return '-' + pre + '-';
                    })();

                if (attrs.swipeMenu) {
                    //eval('var config = ' + attrs.swipeMenu);
                    var config = $parse(attrs.swipeMenu)();
                    if (angular.isDefined(config.menuWidth) && !isNaN(parseInt(config.menuWidth))) {
                        menuWidth = parseInt(config.menuWidth);
                        slideTolerance = menuWidth / 2;
                    }
                    if (angular.isDefined(config.direction)) {
                        direction = config.direction;
                    }
                }
                // 添加一个控制动态宽度的样式
                $elem.addClass('swipe-menu-width-' + menuWidth + ' swipe-menu-' + direction);

                $swipe.bind($elem, {
                    start: function (coords, event) {
                        toleranceMet = false;
                        startCoords = angular.copy(lastCoords = coords);
                    },
                    end: function (coords, event) {
                        endCoords = coords;

                        $elem.removeAttr('style').addClass(transitionClass).removeClass(isSlidingClass);
                        if(!toleranceMet) return;

                        // 判断滑动的方向
                        if(coords.x - startCoords.x > slideTolerance) dir = 'right';
                        if(coords.x - startCoords.x < (-1 * slideTolerance)) dir = 'left';

                        var opened = false;
                        if (direction == 'leftToRight') {
                            opened = dir == 'right';
                        } else {
                            opened = dir == 'left';
                        }
                        if(opened) {
                            $elem.addClass(openClass);
                        }
                        else {
                            $elem.removeClass(openClass)
                        };

                        $rootScope.$broadcast('swipeMenuToggled', opened);
                    },
                    move: function (coords, event) {
                        // 是否有必要处理
                        if(!toleranceMet && Math.abs(startCoords.x - coords.x) < tolerance) return;
                        dir = lastCoords.x < coords.x ? 'right' : 'left';
                        $elem.removeClass(transitionClass).addClass(isSlidingClass);

                        // 限制水平滑动的最大范围
                        var x = coords.x - startCoords.x;
                        if (direction == 'leftToRight') {
                            x += ($elem.hasClass(openClass) ? menuWidth : 0);
                            x = Math.max(0, Math.min(menuWidth, x));
                        } else {
                            x -= ($elem.hasClass(openClass) ? menuWidth : 0);
                            x = Math.min(0, Math.max(0 - menuWidth, x));
                        }

                        // 感谢GPU提供的平滑动画效果:)
                        var props = {};
                        props[prefix + 'transform'] = 'translate3d(' + x + 'px, 0, 0)';
                        $elem.css(props);

                        lastCoords = coords;
                        toleranceMet = true;
                    },
                    cancel: function (coords, event) {
                        $elem.addClass(transitionClass).removeClass(isSlidingClass);
                        $elem.removeAttr('style');
                    }
                });

                $rootScope.$on('toggleSwipeMenu', function(event, isOpen) {
                    $elem.toggleClass(openClass, isOpen);
                });
            }
        };
    }]);

});