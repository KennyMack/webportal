'use strict';

module.exports = function(grunt) {

    var authConfig = {
        pathapi: './api',
        dist: './api/dist'
    };

    // Project configuration.
    grunt.initConfig({
        apicfg: authConfig,
        pkg: grunt.file.readJSON('./api/package.json'),
        //jshint: {
        //    options: {
        //        jshintrc: '.jshintrc',
        //        reporter: require('jshint-stylish')
        //    },
        //    all: {
        //        src: [
        //            'Gruntfile.js',
        //            '<%= apicfg.pathapi %>/{,*/}*.js'
        //        ]
        //    }
        //},
        uglify: {
            options: {
                banner: '/*! <%= apicfg.pathapi %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: '<%= apicfg.pathapi %>/{,*/}*.js',
                dest: '<%= apicfg.pathapi %>/dist/{,*/}*.min.js'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};