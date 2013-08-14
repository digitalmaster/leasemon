module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
      },
      dist: {
        src: [
          'bower_components/jquery/jquery.js',
          'bower_components/underscore/underscore.js',
          'bower_components/backbone/backbone.js',
          'bower_components/backboneValidateAll/src/javascripts/Backbone.validateAll.js',
          'bower_components/moment/moment.js',
          'bower_components/pikaday/pikaday.js',
          'js/main.js', 
        ],
        dest: 'production/js/<%= pkg.name %>.js',
      },
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        report: 'min'
      },
      build: {
        files: {
          'production/js/<%= pkg.name %>.min.js' : ['production/js/<%= pkg.name %>.js']
        } 
      }
    },

    cssmin: {
      options: {},
      combine: {
        files: {
          'production/css/<%= pkg.name %>.min.css' : 
          [
            'bower_components/bootswatch/flatly/bootstrap.css',
            'bower_components/font-awesome/css/font-awesome.css',
            'bower_components/Pikaday/css/pikaday.css',
            'css/main.css'
          ]
        }
      },

      add_banner: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        },
        files: {
          'production/css/<%= pkg.name %>.min.css': ['production/css/<%= pkg.name %>.min.css']
        }
      }

    },

    groundskeeper: {
      compile: {
        files: {
          'production/js/<%= pkg.name %>.js': 'production/js/<%= pkg.name %>.js' 
        }
      }
    },

    htmlbuild: {
      dist: {
        src: 'index.html',
        dest: 'production/',
        options: {
          scripts: {
            min: [
              'production/js/leasemon.min.js'
            ]
          },
          styles: {
            all: [
              'production/css/leasemon.min.css'
            ]
          }
        }
      }
    },

    copy: {
      main: {
        expand: true,
        src: 'bower_components/font-awesome/font/*',
        dest: 'production/font/',
        flatten: true
      }
    }
  
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-groundskeeper');
  grunt.loadNpmTasks('grunt-html-build');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['concat','groundskeeper', 'uglify', 'cssmin', 'htmlbuild', 'copy']);

};