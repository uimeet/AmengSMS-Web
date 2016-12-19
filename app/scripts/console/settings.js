'use strict';

define(['angular', 'common/settings'], function (angular, settings) {
    angular.extend(settings, {
        // 使用的皮肤
        theme_prefix : 'themes/default/console',
        // 模板前缀
        tpl_prefix: 'themes/default/console/tpl',
    });
    // 静态文件前缀
    settings.static_prefix = '/' + settings.theme_prefix;
    settings.api_prefix += '/console';
    angular.module('amengsms.settings',[]).constant('settings', settings);
    return settings;
});