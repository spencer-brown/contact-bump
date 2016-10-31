module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      dist: {
        options: {
          loadPath: [
            'bower_components/bootstrap-sass/assets/stylesheets',
            'bower_components/font-awesome/scss'
          ]
        },
        files: {
          'public/css/main.css': 'public/sass/main.scss'
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      css: {
        files: [
          'public/sass/*.scss'
        ],
        tasks: [
          'sass',
          'concat'
        ]
      },
      html: {
        files: [
          'views/*'
        ]
      }
    },
    nodemon: {
      dev: {
        script: 'index.js',
        options: {
          args: [
            'env=dev'
          ],
          ignore: [
            'node_modules/**',
            'bower_components/**',
            'public/**',
            'views/**'
          ]
        }
      }
    },
    concurrent: {
      start: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'bower_components/jquery/dist/jquery.min.js'
        ],
        dest: 'public/js/build.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('start', ['concat', 'concurrent:start']);
};
