/* globals module:true */
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		appRoot: 'assets',
		buildPath: 'dist',
		bootstrapBuildPath: 'bootstrap',
		tempLessOut: 'less-compiled.css',
		tempJSOut: 'js-temp.js',
		staticRoot: 'static',
		staticDist: '<%= staticRoot %>/dist',

		connect: {
			dev: {
				options: {
					port: 8080,
					base: '.',
					keepalive: true,
					hostname: '*' // to allow access to server from outside
				}
			},
			prod: {
				options: {
					port: 8080,
					base: '<%= buildPath %>',
					keepalive: true,
					hostname: '*' // to allow access to server from outside
				}
			}
		},

		jshint: {
			options: {
				// Have jshint task look for a .jshintrc config file
				// NOTE: .jshintrc is placed relative to the files
				// beint linted, and if not found, linter will search
				// the directory tree going up until it reaches root
				jshintrc: true
			},
			main: {
				options: {
					// General options
					ignores: [
						'<%= appRoot %>/js/vendor/*',
						'<%= appRoot %>/js/entities/static/*',
						'<%= appRoot %>/js/*.min.js'
					]
				},
				src: '<%= appRoot %>/js/**/*.js'
			}
		},

		clean: {
			options: {
				// clean files outside current working dir (CWD)
				force: true
			},
			'main-all': {
				src: [
					'<%= buildPath %>'
				]
			},
			'main-temp': {
				src: [
					'<%= buildPath %>/tmp'
				]
			},
			'static': {
				src: [
					'<%= staticDist %>'
				]
			}
		},

		less: {
			options: {
				cleancss: true,
				compress: true,
				optimization: 10
			},
			main: {
				files: {
					'<%= buildPath %>/assets/css/main.css': '<%= appRoot %>/css/style.less'
				}
			},
			bootstrap: {
				files: {
					'<%= bootstrapBuildPath %>/bootstrap.css': '<%= appRoot %>/css/bootstrap/bootstrap.less'
				}
			}
		},

		requirejs: {
			compile: {
				options: {
					// Main conf file, NOT relative to baseUrl
					mainConfigFile: '<%= appRoot %>/js/require_main.js',
					// Output file location, NOT relative to baseUrl
					out: '<%= buildPath %>/tmp/<%=tempJSOut%>',
					// Modules root dir. All paths below are relative to this
					baseUrl: '<%= appRoot %>/js',
					// Use (lightweight) almond.js instead of require.js
					// NOTE 1: defining name results in single optimized file
					// NOTE 2: almond.js does NOT work with require 'async' plugin
					// name: 'vendor/almond',
					name: 'vendor/require',
					// Include our main app file (same as conf file)
					// nls files are not inlined automatically
					include: [
						'require_main',
						// 'nls/el-gr/core',
						// 'nls/el-gr/messages',
						// 'nls/el-gr/artist_intro'
					],
					// For shimmed dependencies that depend on AMD modules with dependencies of their own
					// (e.g. Marionette depends on Backbone(AMD) which depends on jQuery)
					// In Require.js 2.0+ defining a module will not result in loading it. Require will load
					// it (and execute its callback function) when it is explicitly needed by another *module*.
					// wrapShim converts all shimmed libraries to require modules (wrapping them inside define()),
					// thus forcing their dependencies to load.
					// NOTE: this is needed for AMD version of Backbone (1.1.2+) to work
					// NOTE: USE WITH CAUTION as it breaks dependencies for other libraries
					wrapShim: true,
					// For the dependencies set by nested calls to require()
					findNestedDependencies: true,
					// We use a custom optimizer
					optimize: 'none'
				}
			}
		},

		removelogging: {
			main: {
				src: '<%= buildPath %>/tmp/<%=tempJSOut%>', // The file will be overwritten with the output
				options: {
					// replaceWith: ';',
					namespace: ['console', 'window.console'],
					methods: [
						'log',
						'info'
					]
				}
			}
		},

		strip: {
			main: {
				src: '<%= buildPath %>/tmp/<%=tempJSOut%>', // The file will be overwritten with the output
				// dest: '<%= buildPath %>/tmp/<%=tempJSOut%>', // The file will be overwritten with the output
				options: {
					nodes: ['console.log', 'console.info'],
					inline: true
				}
			}
		},

		uglify: {
			main: {
				files: [{
					'<%= buildPath %>/tmp/<%=tempJSOut%>': '<%= buildPath %>/tmp/<%=tempJSOut%>'
				}]
			},
			vendor: {
				files: [{
					expand: true,
					cwd: '.',
					src: '<%= appRoot %>/js/vendor/*.js',
					dest: '<%= buildPath %>'
				}]
			}
		},

		env: {
			options: {
				/* Shared Options Hash */
				//globalOption : 'foo'
			},
			dev: {
				NODE_ENV: 'DEVELOPMENT'
			},
			prod: {
				NODE_ENV: 'PRODUCTION'
			},
			debug: {
				NODE_ENV: 'DEBUG'
			}
		},

		// HTML Preprocessor
		preprocess: {
			'main-dev': {
				src: 'index_dev.html',
				dest: 'index.html'
			},
			'main-prod': {
				src: 'index_dev.html',
				dest: '<%= buildPath %>/index.html',
				// dest: '<%= pkg.version %>/<%= now %>/<%= ver %>/index.html',
				options: {
					context: {
						name: '<%= pkg.name %>',
						version: '<%= pkg.version %>',
						now: '<%= now %>',
						ver: '<%= ver %>'
					}
				}
			}
		},

		copy: {
			favicon: {
				files: [{
					// expand: true,
					src: 'favicon.png',
					dest: '<%= buildPath %>/favicon.png'
				}, {
					// expand: true,
					src: 'apple-touch-icon-precomposed.png',
					dest: '<%= buildPath %>/apple-touch-icon-precomposed.png'
				}]
			},
			fonts: {
				files: [{
					expand: true,
					src: '<%= appRoot %>/fonts/**',
					dest: '<%= buildPath %>'
				}]
			},
			svg: {
				files: [{
					expand: true,
					src: '<%= appRoot %>/img/svg/**',
					dest: '<%= buildPath %>'
				}]
			},
			'error-pages': {
				files: [{
					expand: true,
					src: '404.html',
					dest: '<%= buildPath %>'
				}, {
					expand: true,
					src: '500.html',
					dest: '<%= buildPath %>'
				}]
			},
			js: {
				files: [{
					expand: false,
					src: '<%= buildPath %>/tmp/<%=tempJSOut%>',
					dest: '<%= buildPath %>/assets/js/main.js'
				}]
			},
			img: {
				files: [{
					expand: true,
					src: '<%= appRoot %>/img/**',
					dest: '<%= buildPath %>'
				}]
			}
		},

		imagemin: { // Task
			options: { // Target options
				optimizationLevel: 3,
				cache: false // prevents empty image bug
			},
			main: {
				files: [{
					expand: true, // Enable dynamic expansion
					cwd: '<%= appRoot %>/img', // Src matches are relative to this path
					src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
					dest: '<%= buildPath %>/assets/img' // Destination path prefix
				}]
			}
		},

		// Javascript Preprocessor
		preprocessor: {
			'js-prod': {
				options: {
					root: '.',
					separator: ';',
					context: {
						PRODUCTION: true
					}
				},
				files: {
					'<%= buildPath %>/tmp/<%=tempJSOut%>': '<%= buildPath %>/tmp/<%=tempJSOut%>'
				}
			}
		},

		plato: {
			options: {
				exclude: /\.min\.js$/
			},
			analyse: {
				files: {
					'plato_reports': [
						'<%= appRoot %>/js/**/*.js',
						'!<%= appRoot %>/js/vendor/**/*.js',
						'!<%= appRoot %>/js/entities/static/*.js',
						'!<%= appRoot %>/js/nls/**/*.js',
						'!<%= appRoot %>/js/i18n.js',
						'!<%= appRoot %>/js/apps_old/**/*'
					]
				}
			}
		}
	});

	// Import already installed tasks from npm
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-strip');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-plato');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-preprocessor');


	// Preprocess html files for dev
	grunt.registerTask('dev-preprocess', [
		'env:dev',
		'preprocess:main-dev'
	]);
	// [DEFAULT] Run in dev mode (uncompressed, uncompiled, unbundled, with logging)
	grunt.registerTask('dev-run', [
		'jshint:main',
		'dev-preprocess',
		'connect:dev'
	]);
	// Build main-app-related assets
	grunt.registerTask('build', [
		'jshint:main',
		'env:prod',
		'clean:main-all',
		'less:main',
		'requirejs',
		'strip:main',
		'preprocessor:js-prod',
		'uglify:main',
		'uglify:vendor',
		'copy:js',
		'copy:fonts',
		'copy:svg',
		// 'copy:favicon',
		// 'copy:error-pages',
		'imagemin:main',
		'preprocess:main-prod',
		'clean:main-temp',
	]);
	// Build using uncompressed assets & logging
	grunt.registerTask('debug-build', [
		'jshint:main',
		'env:prod',
		'clean:main-all',
		'less:main',
		'requirejs',
		'preprocessor:js-prod',
		'uglify:vendor',
		'copy:js',
		'copy:fonts',
		'copy:svg',
		'imagemin:main',
		'preprocess:main-prod',
		'clean:main-temp',
	]);
	// Run using uncompressed assets & logging
	grunt.registerTask('debug-run', [
		'debug-build',
		'connect:prod'
	]);
	// Build bootstrap
	grunt.registerTask('build-bootstrap', [
		'less:bootstrap'
	]);

	// Create /build folder for production
	grunt.registerTask('build-all', [
		'build',
		'dev-preprocess',
		'build-bootstrap'
	]);
	// Run using built assets for productopm
	grunt.registerTask('prod-run', [
		'build-all',
		'connect:prod'
	]);

	// Default task
	grunt.registerTask('default', ['dev-run']);
};