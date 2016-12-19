;
(function (define) {

    define(['jQuery', 'angular', 'common/common'], function ($, angular) {
        /**
         * 配置加载时调用
         */
        var loadStart = function () {
            $('#app-launch').show();
        };
        /**
         * 配置加载完成时调用
         */
        var loadCompleted = function () {
            $('#app-launch').remove();
        };
        var settings = {
            // 是否开启调试模式
            debug: true,
             // API 前缀
            api_prefix : 'http://127.0.0.1:8080/api',
            // 站点名称
            site_name : '白鹿小说',
            // 口号
            site_slogan: '打造全能阅读平台',
            // 使用的皮肤
            theme_prefix : 'themes/default',
            // 静态文件前缀
            static_prefix: '',
        };
        // 静态文件前缀
        settings.static_prefix += '/' + settings.theme_prefix;
        // 加载远程配置
        settings.load = function () {
            // 开始加载
            loadStart();
            var deferred = $.Deferred();
            var start = (new Date()).getTime();
            $.get(settings.api_prefix + '/launch?rn=' + start, function (response) {
                if (response.code == 0) {
                    settings = $.extend(settings, response.data || {});
                    if (typeof(getWeixin) != undefined) {
                        settings = $.extend(settings, { 'weixin': getWeixin() });
                    }
                    // 设置静态路径
                    if (angular.isDefined(settings.static_url_prefix)) {
                        settings.static_prefix = settings.static_url_prefix + settings.static_prefix;
                    }
                    deferred.resolve(settings);
                } else {
                    deferred.reject(response.code, response.message);
                }
                // 加载完成
                setTimeout(function () { loadCompleted(); }, 500);
            }, 'json');
            return deferred.promise();
        };

        angular.module('amengsms.settings',[]).constant('settings', settings);
        return settings;
    });

})(define);