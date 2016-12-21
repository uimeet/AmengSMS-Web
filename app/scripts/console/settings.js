'use strict';

define(['angular', 'common/settings'], function (angular, settings) {
    angular.extend(settings, {
        // 使用的皮肤
        theme_prefix : 'themes/default/console',
        // 模板前缀
        tpl_prefix: 'themes/default/console/tpl',
        // 获取随机上传域名
        random_upload_domain: function () {
            if (settings.upload_domains.length == 1) {
                return settings.upload_domains[0];
            } else if (settings.upload_domains.length > 1) {
                var index = parseInt(Math.random() * 1000) % settings.upload_domains.length;
                return settings.upload_domains[index];
            }
            return null;
        }
    });
    // 静态文件前缀
    settings.static_prefix = '/' + settings.theme_prefix;
    settings.api_prefix += '/console';
    angular.module('amengsms.settings',[]).constant('settings', settings);
    return settings;
});