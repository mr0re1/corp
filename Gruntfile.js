module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jade: {
      compile: {
        options: {
          client: true,
          compileDebug: false,
        },
        files: {
          'public/templates.js': ['templates/**/*.jade']
        }
      }
    },
    less: {
      development: {
        options: {

        },
        files: {
           'public/stylesheets/style.css': 'styles/*.less'
        }
      }
    },
    watch: {
      templates: {
        files: ['templates/**/*.jade'],
        tasks: ['jade']
      },
      css: {
        files: ['styles/*.less'],
        tasks: ['less']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  //grunt.registerTask('test', ['uglify']);

};