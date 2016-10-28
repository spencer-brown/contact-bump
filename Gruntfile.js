module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      dist: {
        options: {
          loadPath: [
            'bower_components/bootstrap-sass/assets/stylesheets'
          ]
        },
        files: {
          'public/css/main.css': 'public/sass/main.scss'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('default', ['sass']);
};
