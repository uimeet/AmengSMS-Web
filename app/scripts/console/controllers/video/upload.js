;
define([
    'angular',
    'webuploader',
    'angular-growl',
    'common/services/http',
    'common/factories/uibDialog',
    'console/settings'
], function (angular, webuploader) {

    var controller = function ($rootScope, $scope, $http, growl, uibDialog, settings) {
        var scope = $scope.scope = {};
        var uploader = webuploader.Webuploader.create({
            swf: settings.static_prefix + '/img/Uploader.swf',
            server: 'http://' + settings.random_upload_domain() + '/upload',
            pick: 'div.jFiler .jFiler-input-choose-btn',
            runtimeOrder: 'flash',
            chunked: true,
            accept: {
                title: 'Videos',
                extensions: 'avi,mp4',
                mimeTypes: 'video/*'
            },
            fileNumLimit: 100,
            fileSingleSizeLimit: 2 * 1024 * 1024 * 1024,
            duplicate: true,
            dnd: 'div.jFiler .jFiler-input-dragDrop'
        });
        scope.upload = function () {
            console.log(123);
            uploader.upload();
        };
    };

    angular.module('amengsms.console.controllers.video.upload', [
        'amengsms.services.http',
        'amengsms.factories.uibDialog',
        'amengsms.settings',
        'angular-growl'
    ]).controller('amengsms.console.controllers.video.upload', [
        '$rootScope',
        '$scope',
        '$cc',
        'growl',
        'uibDialog',
        'settings',
        controller
    ]);

});