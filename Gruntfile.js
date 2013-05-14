module.exports = function(grunt) {

 	// Project configuration.
  grunt.initConfig({
	  stylus:{
		  compile: {
		    options: {
		      import: []
		    },
		    files: {
		      'public/generated/stylesheets/style.min.css': 'public/stylesheets/style.styl'
		      }
		  }
	  },
	  mochaTest: {
		  files: ['test/**/*.js']
      },
	  mochaTestConfig: {
		  options: {
		    reporter: 'list',
		    ui: 'bdd'       
	    }
	  },
	  watch: {
		scripts: {
		    files: ['public/stylesheets/**/*.styl'],
		    tasks: ['default']
		 },
		test: {
	      files: ['models/*', 'controllers/*', 'test/**/*.js'],
	      tasks: ['test'],
	    },
	  },
	  uglify: {
	  	options: {
		  mangle: false	
	  	},
	    app: {
	      	files: {
	        	'public/generated/js/app.min.js': 
	        	[
		        	'public/js/can.jquery.js', 
		        	'public/js/app.js', 
		        	'public/js/**/*.js',
		        	'public/js/can.jquery.min.js',
		        	'public/socket.io/socket.io.js',
		        	'public/js/app.js',
		        	'public/js/app/templates.js',
		        	'public/js/app/models/room.js',
		        	'public/js/app/controllers/chat.js'
	        	]
	        }	
	     }
	  }
  });

  // Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-mocha-test');

  // Default task(s).
  grunt.registerTask('default', ['stylus','uglify']);
  grunt.registerTask('test', 'mochaTest');

};