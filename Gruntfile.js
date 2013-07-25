module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jade: {
      compile: {
        options: {
          client: true,
          compileDebug: false
        },
        files: {
          'public/templates.js': ['templates/**/*.jade']
        }
      }
    },
    concat: {
      jade: {
        src: ["node_modules/jade/runtime.min.js","public/templates.js"],
        dest: "public/templates.js"
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
        tasks: ['jade', 'concat:jade']
      },
      css: {
        files: ['styles/*.less'],
        tasks: ['less']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

};