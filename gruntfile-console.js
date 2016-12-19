module.exports = function (grunt) {
    var config = grunt.file.readJSON('app/grunt.json');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
            app: {
                files: {
                    'app/themes/default/console/css/style.min.css': [
                        'app/vendor/bootstrap/dist/css/bootstrap.css',
                        'app/vendor/angular-growl-v2/build/angular-growl.css',
                        'app/vendor/angular-busy/dist/angular-busy.css',
                        'app/vendor/ng-tags-input/ng-tags-input.css',
                        'app/vendor/ng-tags-input/ng-tags-input.bootstrap.css',
                        'app/vendor/v-button/dist/v-button.css',
                        'app/vendor/select2/select2.css',
                        'app/vendor/angular-awesome-slider/src/css/angular-awesome-slider.css',
                        'app//vendor/angular-material/angular-material.css',
                        'app/themes/default/console/css/*.css'
                    ]
                }
            }
        },
        html2js: {
            options: {
                base: 'app',
                module: 'amengsms.templates',
                amd: true,
                amdPrefixString: "define('amengsms.templates', ['angular'], function(angular){\n",
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                  }
            },
            main: {
                src: ['app/themes/default/console/tpl/**/*.html'],
                dest: 'app/dist/console/modules.all.js'
            }
        },
        requirejs: {
            app: {
                options: {
                    baseUrl: 'app/scripts',
                    dir: 'app/dist',
                    optimize: 'none',
                    mainConfigFile: 'app/scripts/main-grunt.js',
                    cjsTranslate: true,
                    findNestedDependencies: true,
                    skipModuleInsertion: false,
                    wrapShim: true,
                    onBuildWrite: function (moduleName, path, contents) {
                        if (config.exclude && config.exclude.indexOf(moduleName) > -1) {
                            return contents;
                        }
                        for (var i = 0; i < config.appModuleDirs.length; i ++) {
                            if (path.indexOf(config.appModuleDirs[i]) >= 0) {
                                return contents.replace('define(', "define('" + moduleName + "', ");
                            }
                        }
                        if (config.shim) {
                            var shim = config.shim[moduleName];
                            if (shim) {
                                var define = ['define("' + moduleName + '", ['];


                                var deps = shim.deps;
                                if (deps)
                                    define.push('"' + deps.join('","') + '"');

                                if (shim['return']) {
                                    define.push('], function () { return ' + moduleName + '; });');
                                } else {
                                    define.push('], function () {});');
                                }
                                return contents + '\n\n\n' + define.join("");

                            }
                        }

                        return contents + '\n\n\ndefine("' + moduleName + '", function () {});';
                    }

                }
            }
        },

        concat: {
            app: {
                options: {
                    banner: '/*!\n * <%= pkg.name %> - JS for Debug\n * @licence <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n * NoSite | Licence: MIT\n */\n'
                },
                src: [
                    'app/dist/jquery.js',
                    'app/dist/angular.js',
                    'app/dist/angular-i18n.js',
                    'app/dist/angular-animate.js',
                    'app/dist/angular-base64.js',
                    'app/dist/angular-bootstrap.js',
                    'app/dist/angular-cookies.js',
                    'app/dist/angular-growl.js',
                    'app/dist/angular-resource.js',
                    'app/dist/angular-route.js',
                    'app/dist/angular-sanitize.js',
                    'app/dist/angular-ui-router.js',
                    'app/dist/angular-w5c-validator.js',
                    'app/dist/angular-busy.js',
                    'app/dist/select2.js',
                    'app/dist/select2-locale-zh-CN.js',
                    'app/dist/angular-ui-select2.js',
                    'app/dist/angular-audio.js',
                    'app/dist/angular-awesome-slider.js',
                    'app/dist/angular-md5.js',
                    'app/dist/v-button.js',
                    'app/dist/datejs.js',
                    'app/dist/qrcode-generator.js',
                    'app/dist/qrcode_UTF8.js',
                    'app/dist/angular-qrcode.js',
                    'app/dist/datejs.js',
                    'app/dist/*.js',
                    'app/dist/common/**/*.js',
                    'app/dist/console/**/*.js',
                    '!app/dist/front/*.js',
                    '!app/dist/main.js',
                    '!app/dist/main-grunt.js',
                    '!app/dist/dev/*.js'
                ],
                dest: 'app/js/console/app.js'
            }
        },
        uglify: {
            app: {
                options: {
                    banner: '/*!\n * <%= pkg.name %> - compressed JS\n * @licence <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n * http://blog.csdn.net/jennieji | Licence: MIT\n */\n'
                },
                files: {
                    'app/js/console/app.min.js': ['<%= concat.app.dest %>']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-html2js');

    grunt.registerTask('app', ['cssmin', 'requirejs', 'html2js', 'concat', 'uglify']);

};