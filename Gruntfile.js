module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/* <%= pkg.title %> v<%= pkg.version %>\n' + ' * <%= pkg.homepage %>\n' + ' *\n' + ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' + ' * Licensed under the MIT license.\n' + ' */\n\n'
    },
    rig: {
      build: {
        options: {
          banner: '<%= grunt.config.get("meta").banner %>'
        },
        files: {
          'build/<%= pkg.name %>.js': ['src/<%= pkg.name %>.js']
        }
      }
    },
    uglify: {
      options: {
        banner: '/* <%= pkg.title %> v<%= pkg.version %> */\n',
        report: 'min'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    release: {
      options: {
        bump: false, //default: true
        npm: false, //default: true
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-release');

  grunt.registerTask('default', ['uglify', 'rig']);
  grunt.registerTask('release', ['release']);

};