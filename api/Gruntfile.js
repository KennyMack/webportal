'use strict';

module.exports = function(grunt) {

    var authConfig = {
        pathapi: './',
        dist: './dist'
    };

    // Project configuration.
    grunt.initConfig({
        apicfg: authConfig,
        pkg: grunt.file.readJSON('./package.json'),
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! Aplicação desenvolvida para controle de turmas de alunos <%= apicfg.pathapi %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                files: {
                    '<%= apicfg.dist %>/bin/www': '<%= apicfg.pathapi %>bin/www',
                    '<%= apicfg.dist %>/app.js': '<%= apicfg.pathapi %>app.js',
                    '<%= apicfg.dist %>/auth/auth.js': '<%= apicfg.pathapi %>auth/auth.js',
                    '<%= apicfg.dist %>/config/config.js': '<%= apicfg.pathapi %>config/config.js',
                    '<%= apicfg.dist %>/controller/users-controller.js': '<%= apicfg.pathapi %>controller/users-controller.js',
                    '<%= apicfg.dist %>/database/database.js': '<%= apicfg.pathapi %>database/database.js',
                    '<%= apicfg.dist %>/models/users-model.js': '<%= apicfg.pathapi %>models/users-model.js',
                    '<%= apicfg.dist %>/routes/auth.js': '<%= apicfg.pathapi %>routes/auth.js',
                    '<%= apicfg.dist %>/routes/index.js': '<%= apicfg.pathapi %>routes/index.js',
                    '<%= apicfg.dist %>/routes/users.js': '<%= apicfg.pathapi %>routes/users.js',
                    '<%= apicfg.dist %>/utils/utils.js': '<%= apicfg.pathapi %>utils/utils.js'

                }
            }
        }
        /*{
         '<%= apicfg.dist %>/api.min.js': [
         '<%= apicfg.pathapi %>bin/www',
         '<%= apicfg.pathapi %>app.js',
         '<%= apicfg.pathapi %>auth/*.js',
         '<%= apicfg.pathapi %>config/*.js',
         '<%= apicfg.pathapi %>controller/*.js',
         '<%= apicfg.pathapi %>database/*.js',
         '<%= apicfg.pathapi %>models/*.js',
         '<%= apicfg.pathapi %>routes/*.js',
         '<%= apicfg.pathapi %>utils/*.js'
         ]
         }*/

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
        //uglify: {
        //    options: {
        //        banner: '/*! Aplicação desenvolvida para controle de turmas de alunos <%= apicfg.pathapi %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        //    },
        //    build: {
        //        src: [
        //            '<%= apicfg.pathapi %>bin/www',
        //            '<%= apicfg.pathapi %>app.js',
        //            '<%= apicfg.pathapi %>config/*.js',
        //            '<%= apicfg.pathapi %>controller/*.js',
        //            '<%= apicfg.pathapi %>database/*.js',
        //            '<%= apicfg.pathapi %>models/*.js',
        //            '<%= apicfg.pathapi %>routes/*.js',
        //            '<%= apicfg.pathapi %>utils/*.js'
        //        ],
        //        dest:
        //            '<%= apicfg.dist %>/api.min.js'
        //
        //    }
        //}
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};