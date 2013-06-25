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

    #compiled js directoty
    coffeeDir: "public/coffee"
    compJsSrcDir: "public/compiledJS"

    #handlebars files
    hbDir: "public/handlebars"
    hbCompiled: "apptemplates.js"

    #tests
    testDir: "tests/"

    #sass files
    sassDir: "public/sass"
    mainSassFile: "app.sass"
    sassCompiled: "appsass.css"

    #output files
    distDir: "public/dist"

    clean: ['public/compiledJS']
      
    minispade:
      options:
        renameRequire: true
        useStrict: true
        prefixToRemove: '<%= compJsSrcDir %>'+'/'
      files:
        src: ['<%= compJsSrcDir %>/**/*.js']
        dest: '<%= distDir %>/<%= jsCompiled %>'

    emberTemplates:
      compile:
        options:
          templateName: (sourceFile) ->
            #TODO: THIS IS HARDCODED...SHOULD CHANGE TO REF GLOBAL
            return sourceFile.replace("public/handlebars/", "")
        files:
          "<%= distDir%>/<%= hbCompiled %>": "<%= hbDir %>/**/*.handlebars"

    coffee:
      options:
        bare: true
      glob_to_multiple:
        expand: true
        cwd: '<%= coffeeDir %>'
        src: ['**/*.coffee']
        dest: '<%= compJsSrcDir %>'
        ext: '.js'
      
    sass:
      dist:
        options:
          trace: true
          style: 'expanded'
        files:
          '<%= distDir %>/<%= sassCompiled %>': '<%= sassDir %>/<%= mainSassFile %>'

    watch:
      sass:
        files: ['<%= sassDir %>/**/*.sass']
        tasks: ['sass']
        options:
          livereload: true

      coffee:
        files: ['<%= coffeeDir %>/**/*.coffee']
        tasks: ['clean', 'coffee', 'minispade']
        options:
          livereload: true

      handlebars:
        files: ['<%= hbDir %>/**/*.handlebars']
        tasks: ['emberTemplates']
        options:
          livereload: true

  require('matchdep').filterDev('grunt-*').forEach grunt.loadNpmTasks
  
  grunt.registerTask('default', [
                                        'clean',
                                        'emberTemplates',
                                        'sass',
                                        'coffee',
                                        'minispade',
                                        'watch'])
