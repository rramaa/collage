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
    require('jit-grunt')(grunt);


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
                    '<%= config.dist %>/styles/{,*/}*.css',
                    '<%= config.dist %>/images/{,*/}*.*'
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
                        'images/*'
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
        concurrent: {
            copy: [
                'copy:tmpProd'
            ],
            compile: [
                'babel'
            ]
        },
        usemin: {
            html: ['<%= config.serverDist %>/templates/*.marko', '<%= config.serverDist %>/routes/views/*.marko'],
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
                    modules: [{
                        name: 'app'
                    }]
                }
            }
        },
        'http-server': {

            'dev': {
                root: "<%= config.app %>",
                port: 3000,

                // the host ip address 
                // If specified to, for example, "127.0.0.1" the server will 
                // only be available on that ip. 
                // Specify "0.0.0.0" to be available everywhere 
                host: "0.0.0.0",
                showDir: true,
                autoIndex: true,
                ext: "html",
                runInBackground: true,

                // Tell grunt task to open the browser 
                openBrowser: true,

                // customize url to serve specific pages 
                customPages: {
                    "/modules": "<%= config.tmp %>/modules",
                    "/scripts": "<%= config.tmp %>/scripts",
                    "/styles/images": "<%= config.app %>/images"
                }

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

    grunt.registerTask('build', [
        'clean:dist',
        'concurrent:copy',
        'concurrent:compile',
        'requirejs',
        'copy:dist',
        'filerev',
        'usemin'
    ]);

    grunt.registerTask('serve', [
        'clean:client',
        'copy:tmpDev',
        'babel',
        'http-server',
        // 'browserSync',
        'watch'
    ]);
};