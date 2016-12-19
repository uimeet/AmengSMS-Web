;
define([
    'angular',
    'angular-growl',
    'common/services/http'
], function (angular) {

    var dashboardController = function ($scope, $http, growl) {

    };

    angular.module('amengsms.console.controllers.dashboard', [
        'amengsms.services.http',
        'angular-growl'
    ]).controller('amengsms.console.controllers.dashboard', [
        '$scope',
        '$cc',
        'growl',
        dashboardController
    ]);

});