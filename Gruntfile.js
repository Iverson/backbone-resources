module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/* <%= pkg.title %> v<%= pkg.version %>\n' + ' * <%= pkg.homepage %>\n' + ' *\n' + ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' + ' * Licensed under the MIT license.\n' + ' */\n\n',
      doc_title: '# <%= pkg.title %> v<%= pkg.version %>\n\n'
    },
    rig: {
      build: {
        options: {
          banner: '<%= grunt.config.get("meta").banner %>'
        },
        files: {
          'build/<%= pkg.name %>.js': ['src/<%= pkg.name %>.js']
        }
      },
      readme: {
        options: {
          banner: '<%= grunt.config.get("meta").doc_title %>'
        },
        files: {
          'README.md': ['src/README.md']
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
    push: {
      options: {
        files: ['package.json'],
        updateConfigs: [],
        add: true,
        addFiles: ['.'], // '.' for all files except ingored files in .gitignore
        commit: true,
        commitMessage: 'Release %VERSION%',
        commitFiles: ['-a'], // '-a' for all files
        createTag: true,
        tagName: '-%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        npm: false
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-push-release');

  grunt.registerTask('build', ['uglify', 'rig']);
  grunt.registerTask('publish', ['build', 'bump']);

};