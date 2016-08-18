// Generated on 2015-10-05 using
// generator-webapp 1.1.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required grunt tasks
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
    });


    // Configurable paths
    var config = {
        app: 'app',
        dist: 'dist',
        tmp: '.tmp'
    }

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: config,

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            },
            client: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp'
                    ]
                }]
            }
        },

        // Compiles ES6 with Babel
        babel: {
            options: {
                sourceMap: false
            },
            client: {
                files: [{
                    expand: true,
                    src: ['<%= config.tmp %>/scripts/{,**/}*.js'],
                    ext: '.js'
                }, {
                    expand: true,
                    cwd: '<%= config.tmp %>/modules',
                    src: ['{,**/}*.js'],
                    dest: '<%= config.tmp %>/modules',
                    ext: '.js'
                }]
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= config.dist %>/scripts/{,*/**/}*.js',
                    '<%= config.dist %>/modules/{,*/**/}*.js',
                    '<%= config.dist %>/styles/css/*.css'
                    // '<%= config.dist %>/images/{,*/}*.*'
                ]
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        'images/*',
                        '*.html',
                        'styles/{,**/}*.css'
                    ]
                }]
            },
            tmpDev: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.tmp %>',
                    src: [
                        'modules/{,**/}*.*',
                        'scripts/{,**/}*.*',
                    ]
                }]
            },
            tmpProd: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.tmp %>',
                    src: [
                        'modules/{,**/}*.*',
                        'scripts/{,**/}*.*',
                        'bower_components/{,**/}*.*'
                    ]
                }]
            }
        },
        useminPrepare: {
            html: ['<%= config.dist %>/*.html'],
            options: {
                root: '<%= config.dist %>',
                dest: '<%= config.dist %>',
                flow: {
                    html: {
                        steps: {
                            css: ['concat', 'cssmin']
                        },
                        post: {}
                    }
                }
            }
        },
        watch: {
            js: {
                options: {
                    spawn: false
                },
                files: [
                    '<%= config.app %>/modules/{,**/}*.js',
                    '<%= config.app %>/modules/{,**/}*.html',
                    '<%= config.app %>/scripts/{,**/}*.js',
                    '!<%= config.app %>/scripts/bower_components/{,**/}*.js'
                ],
                tasks: ['clean:client', 'copy:tmpDev', 'babel']
            }
        },
        usemin: {
            html: ['<%= config.dist %>/*.html'],
            options: {
                assetsDirs: [
                    '<%= config.dist %>'
                ]
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "./",
                    appDir: config.tmp,
                    optimize: 'uglify2',
                    mainConfigFile: config.tmp + '/scripts/main.js',
                    dir: config.dist,
                    findNestedDependencies: true,
                    skipDirOptimize: true,
                    wrapShim: true,
                    modules: [{
                        name: 'app',
                        exclude: ['infra']
                    }, {
                        name: 'infra'
                    }]
                }
            }
        },
        'http-server': {

            'dev': {
                root: "<%= config.app %>",
                port: 3001,
                showDir: true,
                autoIndex: true,
                ext: "html",
                runInBackground: true,
                openBrowser: true,
                customPages: {
                    "/modules": "<%= config.tmp %>/modules",
                    "/scripts": "<%= config.tmp %>/scripts",
                    "/styles/images": "<%= config.app %>/images"
                }

            },
            'prod': {
                root: "<%= config.dist %>",
                port: 3000,
                showDir: true,
                autoIndex: true,
                ext: "html",
                runInBackground: false,
                openBrowser: true
            }

        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        '<%= config.app %>/styles/*.css',
                        '<%= config.app %>/scripts/{,**/}*.js',
                        '<%= config.app %>/modules/scripts/{,**/}*.js',
                        '<%= config.app %>/{,**/}*.html',
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: "<%= config.app %>",
                        routes: {
                            "/modules": "<%= config.tmp %>/modules",
                            "/scripts": "<%= config.tmp %>/scripts",
                            "/styles/images": "<%= config.app %>/images"
                        }
                    }
                }
            }
        }
    });

    grunt.registerTask('updatePath', function() {
        var path = config.dist + '/scripts/',
            targetFilename = 'main',
            targetFile = grunt.file.expand(path + targetFilename + '.*'),
            content = grunt.file.read(targetFile[0]);

        var i = null,
            temp = null,
            scripts = grunt.file.expand(config.dist + '/scripts/*.js');

        var startFrom = content.indexOf('require.config');
        var startingIndex = content.indexOf('(', startFrom) + 1,
            endIndex = content.indexOf(')', startFrom),
            obj = JSON.parse(content.slice(startingIndex, endIndex));


        // adding other scripts path to require js config file
        for (i = 0; i < scripts.length; i++) {
            temp = scripts[i].split(config.dist + '/scripts/')[1].split('.');
            obj.paths[temp[0]] = temp[1] !== 'js' ? 'scripts/'+temp[0] + '.' + temp[1] : 'scripts/'+temp[0];
        }

        content = content.slice(0, startingIndex) + JSON.stringify(obj) + content.slice(endIndex);
        grunt.file.write(targetFile[0], content);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'copy:tmpProd',
        'babel',
        'requirejs',
        'copy:dist',
        'useminPrepare',
        'concat',
        'cssmin',
        'filerev',
        'usemin',
        'updatePath'
    ]);

    grunt.registerTask('prodserver', [
        'http-server:prod'
    ])

    grunt.registerTask('localserver', [
        'clean:client',
        'copy:tmpDev',
        'babel',
        'http-server:dev',
        // 'browserSync',
        'watch'
    ]);
};