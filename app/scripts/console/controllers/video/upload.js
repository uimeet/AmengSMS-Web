;
define([
    'angular',
    'webuploader',
    'angular-growl',
    'common/services/http',
    'common/factories/uibDialog'
], function (angular) {

    var controller = function ($rootScope, $scope, $http, growl, uibDialog) {
        var scope = $scope.scope = {};

    };

    angular.module('amengsms.console.controllers.task.task', [
        'amengsms.services.http',
        'amengsms.factories.uibDialog',
        'angular-growl'
    ]).controller('amengsms.console.controllers.task.task', [
        '$rootScope',
        '$scope',
        '$cc',
        'growl',
        'uibDialog',
        controller
    ]);

});