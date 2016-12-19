;
(function () {

    define([
        'angular',
        'angular-ui-select2',
        'console/controllers/login',
        'console/controllers/consoleBase',
        'console/controllers/dashboard',
        'console/controllers/admin/role',
        'console/controllers/admin/roleAdd',
        'console/controllers/admin/user',
        'console/controllers/admin/userAdd',
        'console/controllers/task/task',
        'console/controllers/system/cache'
    ], function (angular) {
        angular.module('amengsms.console.controllers'
            , [
                'ui.select2',
                'amengsms.console.controllers.login',
                'amengsms.console.controllers.consoleBase',
                'amengsms.console.controllers.dashboard',
                'amengsms.console.controllers.adminRole',
                'amengsms.console.controllers.adminRoleAdd',
                'amengsms.console.controllers.adminUser',
                'amengsms.console.controllers.adminUserAdd',
                'amengsms.console.controllers.task.task',
                'amengsms.console.controllers.system.cache'
            ]).run(['uiSelect2Config', function (uiSelect2Config) {
                uiSelect2Config.dropdownAutoWidth = true;
            }]);
    });

})(define);