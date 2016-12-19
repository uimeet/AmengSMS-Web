;
define([
    'angular',
    'common/services/authentication',
    'common/services/comet',
    'common/services/http',
    'common/services/storage'
], function (angular) {
    angular.module('amengsms.services', [
        'amengsms.services.http',
        'amengsms.services.comet',
        'amengsms.services.authentication',
        'amengsms.services.storage'
    ]);
});