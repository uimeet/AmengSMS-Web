;
(function (define) {
    // 控制台基础状态
    var baseState = function (settings) {
        return {
            abstract: true,
            templateUrl: settings.tpl_prefix + '/base.html',
            controller: 'amengsms.console.controllers.consoleBase',
            url: '/console',
            data: {
                pageTitle: settings.site_name + '管理控制台'
            }
        };
    };
    // 首页
    var loginState = function (settings) {
        return {
            templateUrl: settings.tpl_prefix + '/login.html',
            controller: 'amengsms.console.controllers.login',
            url: '/login',
            data: {
                pageTitle: '登录',
            }
        };
    };
    // 仪表盘
    var dashboardState = function (settings) {
        return {
            templateUrl: settings.tpl_prefix + '/dashboard.html',
            controller: 'amengsms.console.controllers.dashboard',
            url: '/dashboard',
            data: {
                pageTitle: '仪表盘'
            }
        }
    };

    /******************************************
     * 视频管理相关
     * ****************************************/
    // 视频基类
    var videoState = function (settings) {
        return {
            abstract: true,
            template: '<ui-view />',
            url: '/video',
            data: {
                pageTitle: '视频管理'
            }
        };
    };
    // 上传视频
    var videoUploadState = function (settings) {
        return {
            templateUrl: settings.tpl_prefix + '/video/upload.html',
            controller: 'amengsms.console.controllers.videoUpload',
            url: '/user',
            data: {
                pageTitle: '视频上传'
            }
        };
    };

    /******************************************
     * 管理用户相关
     * ****************************************/
    // 父状态
    var adminState = function (settings) {
        return {
            abstract: true,
            template: '<ui-view />',
            url: '/admin',
            data: {
                pageTitle: '管理用户'
            }
        };
    };
    // 管理用户账户管理
    var adminUserState = function (settings) {
        return {
            templateUrl: settings.tpl_prefix + '/admin/user.html',
            controller: 'amengsms.console.controllers.adminUser',
            url: '/user',
            data: {
                pageTitle: '管理用户管理'
            }
        };
    };
    // 管理用户新建
    var adminUserAddState = function (settings) {
        return {
            templateUrl: settings.tpl_prefix + '/admin/user_add.html',
            controller: 'amengsms.console.controllers.adminUserAdd',
            url: '/user/add',
            data: {
                pageTitle: '设置管理用户信息'
            }
        };
    };
    // 管理用户编辑
    var adminUserEditState = function (settings) {
        return {
            templateUrl: settings.tpl_prefix + '/admin/user_add.html',
            controller: 'amengsms.console.controllers.adminUserAdd',
            url: '/user/edit/{adminId:[0-9]+}',
            data: {
                pageTitle: '设置管理用户信息'
            }
        };
    };
    // 管理角色管理
    var adminRoleState = function (settings) {
        return {
            templateUrl: settings.tpl_prefix + '/admin/role.html',
            controller: 'amengsms.console.controllers.adminRole',
            url: '/role',
            data: {
                pageTitle: '管理角色管理'
            }
        };
    };
    // 管理角色添加
    var adminRoleAddState = function (settings) {
        return {
            templateUrl: settings.tpl_prefix + '/admin/role_add.html',
            controller: 'amengsms.console.controllers.adminRoleAdd',
            url: '/role/add',
            data: {
                pageTitle: '设置角色信息'
            }
        };
    };
    // 管理角色添加
    var adminRoleEditState = function (settings) {
        return {
            templateUrl: settings.tpl_prefix + '/admin/role_add.html',
            controller: 'amengsms.console.controllers.adminRoleAdd',
            url: '/role/edit/{roleId:[0-9]+}',
            data: {
                pageTitle: '设置角色信息'
            }
        };
    };


    /******************************************
     * 任务管理相关
     * ****************************************/
    // 任务管理
    var taskState = function (settings) {
        return {
            templateUrl: settings.tpl_prefix + '/task/index.html',
            controller: 'amengsms.console.controllers.task.task',
            url: '/task',
            data: {
                pageTitle: '任务管理'
            }
        };
    };


    // ==== 系统相关 ====
    // 系统状态基类
    var systemState = function (settings) {
        return {
            abstract: true,
            template: '<ui-view />',
            url: '/system'
        };
    };
    // 系统缓存管理
    var systemCacheState = function (settings) {
        return {
            templateUrl: settings.tpl_prefix + '/system/cache.html',
            url: '/cache',
            controller: 'amengsms.console.controllers.system.cache',
            data: {
                pageTitle: '缓存管理'
            }
        };
    };

    // 定义这个模块
    define(['console/settings'], function (settings) {
        return {
            login: loginState(settings),
            consoleBase: baseState(settings),
            dashboard: dashboardState(settings),

            admin: adminState(settings),
            adminUser: adminUserState(settings),
            adminUserAdd: adminUserAddState(settings),
            adminUserEdit: adminUserEditState(settings),
            adminRole: adminRoleState(settings),
            adminRoleAdd: adminRoleAddState(settings),
            adminRoleEdit: adminRoleEditState(settings),

            task: taskState(settings),

            system: systemState(settings),
            systemCache: systemCacheState(settings)
        }
    });



})(define);