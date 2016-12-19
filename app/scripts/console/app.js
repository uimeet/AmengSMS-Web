;
(function (define) {
    // 路由配置
    var stateConfig = function ($urlRouterProvider, $stateProvider, consoleStates) {
        $stateProvider
            .state('login', consoleStates.login)
            .state('console', consoleStates.consoleBase)
            .state('console.dashboard', consoleStates.dashboard)

            .state('console.admin', consoleStates.admin)
            .state('console.admin.user', consoleStates.adminUser)
            .state('console.admin.userAdd', consoleStates.adminUserAdd)
            .state('console.admin.userEdit', consoleStates.adminUserEdit)
            .state('console.admin.role', consoleStates.adminRole)
            .state('console.admin.roleAdd', consoleStates.adminRoleAdd)
            .state('console.admin.roleEdit', consoleStates.adminRoleEdit)

            .state('console.task', consoleStates.task)

            .state('console.system', consoleStates.system)
            .state('console.system.cache', consoleStates.systemCache);
        $urlRouterProvider.otherwise('/console/dashboard');
    };
    // 配置项
    var componentConfig = function ($provide, w5cValidatorProvider, growlProvider) {
        // select2 相关配置
        $provide.decorator("uiSelect2Directive", ['$delegate', function ($delegate) {
            var directive = $delegate[0];
            directive.priority = 1000;
            return $delegate;
        }]);
        // w5c Validator 相关配置
        w5cValidatorProvider.config({
            blurTrig: true,
            showError: true,
            removeError: true
        });
        w5cValidatorProvider.setRules({

        });
        // growl 相关配置
        growlProvider.globalTimeToLive(5000);
        // 全局禁止countdown显示
        // 实例需要countdown可以手动配置参数disableCountDown:false
        growlProvider.globalDisableCountDown(true);
        growlProvider.globalPosition('bottom-center');
    };

    define([
        'angular',
        'console/states',
        'console/settings',
        'angular-ui-router',
        'angular-ui-select2',
        'angular-bootstrap',
        'angular-growl',
        'angular-busy',
        'angular-w5c-validator',
        'v-button',
        'common/services',
        'common/directives',
        'console/controllers',
        'amengsms.templates',
    ], function (angular, consoleStates, settings) {
        angular.module('amengsms.console.app', [
            'ui.router',
            'ui.bootstrap',
            'w5c.validator',
            'angular-growl',
            'cgBusy',
            'vButton',
            'amengsms.services',
            'amengsms.directives',
            'amengsms.console.controllers',
            'amengsms.templates'
        ])
        .config([
            '$provide',
            '$urlRouterProvider',
            '$stateProvider',
            'w5cValidatorProvider',
            'growlProvider',
            function ($provide, $urlRouterProvider, $stateProvider, w5cValidatorProvider, growlProvider) {
                stateConfig($urlRouterProvider, $stateProvider, consoleStates);
                componentConfig($provide, w5cValidatorProvider, growlProvider);

        }]).run(['$rootScope', '$location', '$state', 'authentication', function ($rootScope, $location, $state, authentication) {
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                // success
            });
            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                // 如果是未登录状态, 直接跳转到首页
                if (error.authenticated === false) {
                    // 登出操作
                    authentication.logout();
                    // 跳转回首页
                    $rootScope.$evalAsync(function () {
                        $state.go('login');
                        // 用户在未登录的情况下
                        // 从首页直接访问需要登录的页面, 被弹回首页后
                        // angularjs不会广播 $stateChangeStart 事件
                        // 由于一些逻辑依赖这个事件, 所以这里手动广播一次
                        if (fromState.name == 'login') {
                            $rootScope.$broadcast('$stateChangeStart', fromState, fromParams, toState, toParams);
                        }
                    });
                }
            });
            $rootScope.settings = settings;
        }]).value('cgBusyDefaults',{
            message:'Loading',
            backdrop: true,
            templateUrl: settings.tpl_prefix + '/common/loading.html',
            delay: 100,
            minDuration: 700,
            //wrapperClass: 'my-class my-class2'
        });
        settings.load().then(function (_settings) {
            // 启动app
            angular.bootstrap(document, ['amengsms.console.app']);
        }, function (code, message) {
            console.log(code, messages);
            growl.error('初始化出错');
        });
    });

})(define);