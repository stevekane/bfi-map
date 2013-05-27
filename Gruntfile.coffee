'use strict'

module.exports = (grunt) ->
  
  grunt.initConfig
    #javascript files 
    jsDir: "public/javascripts"
    #javascript source files
    jsSrcDir: "<%= jsDir %>/src"
    #javascript libraries
    jsLibDir: "<%= jsDir %>/libs"
    jsCompiled: "client.js"

    #tests
    testDir: "tests/"

    #sass files
    sassDir: "public/sass"
    mainSassFile: "app.sass"
    sassCompiled: "appsass.css"

    #output files
    distDir: "public/dist"

    minispade:
      options:
        renameRequire: true
        useStrict: false
        prefixToRemove: '<%= jsSrcDir %>'+'/'
      files:
        src: ['<%= jsSrcDir %>/**/*.js']
        dest: '<%= distDir %>/<%= jsCompiled %>'

    sass:
      dist:
        options:
          trace: true
          style: 'expanded'
        files:
          '<%= distDir %>/<%= sassCompiled %>': '<%= sassDir %>/<%= mainSassFile %>'

    jshint:
      options:
        laxcomma: true
      all: ['<%= jsSrcDir %>/**/*.js']

    watch:
      sass:
        files: ['<%= sassDir %>/**/*.sass']
        tasks: ['sass']
        options:
          livereload: true

      js:
        files: ['<%= jsSrcDir %>/**/*.js', '<%= testDir %>/**/*.js']
        tasks: ['jshint', 'minispade']
        options:
          livereload: true
    
  grunt.loadNpmTasks('grunt-minispade')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('default', [
                                        'sass',
                                        'minispade',
                                        'jshint',
                                        'watch'])
