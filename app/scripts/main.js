;
(function () {
    var vendorPath = "../vendor";
    require.config({
        baseUrl: "/scripts/",
        skipDataMain: true,
        paths: {
            "jQuery": vendorPath + "/jquery/dist/jquery",
            "angular": vendorPath + "/angular/angular",
            "angular-i18n": vendorPath + "/angular-i18n/angular-locale_zh-cn",
            "angular-route": vendorPath + "/angular-route/angular-route",
            "angular-cookies": vendorPath + "/angular-cookies/angular-cookies",
            "angular-animate": vendorPath + "/angular-animate/angular-animate",
            "angular-resource": vendorPath + "/angular-resource/angular-resource",
            "angular-sanitize": vendorPath + "/angular-sanitize/angular-sanitize",
            "angular-base64": vendorPath + "/angular-base64/angular-base64",
            "angular-growl": vendorPath + "/angular-growl-v2/build/angular-growl",
            "angular-ui-router": vendorPath + "/angular-ui-router/release/angular-ui-router",
            "angular-bootstrap": vendorPath + "/angular-bootstrap/ui-bootstrap-tpls",
            "angular-w5c-validator": vendorPath + "/angular-w5c-validator/w5cValidator",
            "angular-md5": vendorPath + "/angular-md5/angular-md5",
            "angular-file-upload": vendorPath + "/angular-file-upload/dist/angular-file-upload",
            "angular-ui-select2": vendorPath + "/angular-ui-select2/src/select2",
            "select2": vendorPath + "/select2/select2",
            "select2-locale-zh-CN": vendorPath + "/select2/select2_locale_zh-CN",
            "angular-awesome-slider": vendorPath + "/angular-awesome-slider/dist/angular-awesome-slider",
            "angular-audio": vendorPath + "/angular-audio/app/angular.audio",
            "angular-busy": vendorPath + "/angular-busy/dist/angular-busy",
            "v-button": vendorPath + "/v-button/dist/v-button",
            "datejs": vendorPath + "/datejs/build/date-zh-CN",
            "amengsms.templates": "dev/templates",
            "qrcode-generator": vendorPath + "/qrcode-generator/js/qrcode",
            "qrcode_UTF8": vendorPath + "/qrcode-generator/js/qrcode_UTF8",
            "angular-qrcode": vendorPath + "/angular-qrcode/angular-qrcode",
            "angular-material": vendorPath + "/angular-material/angular-material",
            "angular-aria": vendorPath + "/angular-aria/angular-aria",
            "angular-tags-input": vendorPath + "/ng-tags-input/ng-tags-input",
            "angular-touch": vendorPath + "/angular-touch/angular-touch",
            "angulartics": vendorPath + "/angulartics/src/angulartics",
            "angulartics-google-analytics": vendorPath + "/angulartics-google-analytics/lib/angulartics-ga",
            "weixin": "http://res.wx.qq.com/open/js/jweixin-1.1.0",
            "webuploader": vendorPath + "/webuploader/dist/webuploader"
        },
        shim: {
            "jQuery": { "exports": "jQuery" },
            "angular": { "exports": "angular", "deps": ["jQuery"] },
            "angular-i18n": { "exports": "angular-i18n", "deps": ["angular"] },
            "angular-route": { "deps": ["angular"], "exports": "angular-route" },
            "angular-cookies": { "deps": ["angular"], "exports": "angular-cookies" },
            "angular-ui-router": { "deps": ["angular"], "exports": "angular-ui-router" },
            "angular-bootstrap": { "deps": ["angular", "angular-i18n"], "exports": "angular-bootstrap" },
            "angular-base64": { "deps": ["angular"], "exports": "angular-base64" },
            "angular-animate": { "deps": ["angular"] },
            "angular-growl": { "deps": ["angular-animate"] },
            "angular-resource": { "deps": ["angular"] },
            "angular-sanitize": { "deps": ["angular"] },
            "angular-w5c-validator": { "deps": ["angular"] },
            "angular-md5": { "deps": ["angular"] },
            "angular-file-upload": { "deps": ["angular"] },
            "angular-aria": { "deps": ["angular"] },
            "angular-ui-select2": { "deps": ["angular", "select2", "select2-locale-zh-CN"] },
            "angular-material": { "deps": ["angular", "angular-animate", "angular-aria"] },
            "angular-touch": { "deps": ["angular"] },
            "angulartics": { "deps": ["angular"] },
            "angulartics-google-analytics": { "deps": ["angular", "angulartics"] },
            "select2": { "deps": ["jQuery"] },
            "select2-locale-zh-CN": { "deps": ["select2"] },
            "angular-audio": { "deps": ["angular"] },
            "angular-busy": { "deps": ["angular"] },
            "angular-awesome-slider": { "deps": ["angular"] },
            "v-button": { "deps": ["angular"] },
            "qrcode_UTF8": { "deps": ["qrcode-generator"] },
            "angular-tags-input": { "deps": ["angular"] },
            "angular-qrcode": { "deps": ["angular","qrcode_UTF8", "qrcode-generator"] },
            "webuploader": { "deps": ["jQuery"] }
        },
        waitSeconds: 30,
        urlArgs: "v20160714"
    });
}());