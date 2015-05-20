// Load plugins
var gulp = require('gulp'),
	connect = require('gulp-connect'),
	preprocess = require('gulp-preprocess'),
	path = require('path'),
	less = require('gulp-less'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	rjs = require('gulp-requirejs'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	livereload = require('gulp-livereload'),
	del = require('del'),
	runSequence = require('run-sequence');


var appRoot = './assets',
	buildPath = './dist-gulp';

// Web server
gulp.task('connectDev', ['preprocessHtmlDev'], function() {
	connect.server({
		port: 8080,
		livereload: false
	});
});

gulp.task('connectProd', function() {
	connect.server({
		root: buildPath,
		port: 8080,
		livereload: false
	});
});

// Preprocess HTML
gulp.task('preprocessHtmlDev', function() {
	return gulp.src('./index_dev.html')
		.pipe(preprocess({
			context: {
				NODE_ENV: 'DEVELOPMENT',
				DEBUG: true
			}
		}))
		.pipe(rename({
			basename: 'index'
		}))
		.pipe(gulp.dest('./'));
});

// Preprocess HTML
gulp.task('preprocessHtmlProd', function() {
	return gulp.src('./index_dev.html')
		.pipe(preprocess({
			context: {
				NODE_ENV: 'PRODUCTION',
				DEBUG: true
			}
		}))
		.pipe(rename({
			basename: 'index'
		}))
		.pipe(gulp.dest(buildPath));
});

// Styles
gulp.task('styles', function() {
	return gulp.src('./assets/css/style.less')
		.pipe(less())
		.pipe(rename({
			basename: 'main',
			suffix: '.min',
		}))
		.pipe(minifycss())
		.pipe(gulp.dest(buildPath + '/assets/css'));
});

// Scripts
gulp.task('scripts', function() {
	return gulp.src('./assets/js/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest(buildPath + '/assets/js'));
});

// Requirejs Build
gulp.task('requirejsBuild', function() {
	rjs({
			// Main conf file, NOT relative to baseUrl
			mainConfigFile: 'assets/js/config.js',
			// Output file location, NOT relative to baseUrl
			out: 'main.js',
			// Modules root dir. All paths below are relative to this
			baseUrl: 'assets/js',
			// Use (lightweight) almond.js instead of require.js
			// NOTE 1: defining name results in single optimized file
			// NOTE 2: almond.js does NOT work with require 'async' plugin
			// name: 'vendor/almond',
			name: 'vendor/require',
			// Include our main app file (same as conf file)
			// nls files are not inlined automatically
			include: [
				'main',
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
			wrapShim: false,
			// For the dependencies set by nested calls to require()
			findNestedDependencies: true,
			// We use a custom optimizer
			optimize: 'none'
		})
		.pipe(uglify())
		.pipe(rename({
			basename: 'main',
			suffix: '.min'
		}))
		.pipe(gulp.dest(buildPath + '/assets/js')); // pipe it to the output DIR
});

// Images
gulp.task('images', function() {
	return gulp.src('./assets/img/**/*')
		.pipe(cache(imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest(buildPath + '/assets/img'));
});

// Fonts
gulp.task('fonts', function() {
	return gulp.src('assets/fonts/**/*')
		.pipe(gulp.dest(buildPath + '/assets/fonts'));
});

// Clean
gulp.task('clean', function(cb) {
	del([buildPath], cb);
});

// Build everything
gulp.task('build', function(callback) {
	var start = new Date().getTime();
	runSequence(
		'clean',
		['styles', 'requirejsBuild', 'fonts', 'images', 'preprocessHtmlProd'],
		'scripts',
		callback);
});

// Run in production mode
gulp.task('runProd', function(callback) {
	runSequence('build', 'connectProd',	callback);
});

// Default task
gulp.task('default', function() {
	gulp.start('connectDev');
});

// Watch
gulp.task('watch', function() {

	// Watch .less files
	gulp.watch('./assets/css/**/*.less', ['styles']);

	// Watch .js files
	gulp.watch('./assets/js/**/*.js', ['scripts']);

	// Watch image files
	gulp.watch('./assets/img/**/*', ['images']);

	// Create LiveReload server
	livereload.listen();

	// Watch any files in dist/, reload on change
	gulp.watch([buildPath + '/**']).on('change', livereload.changed);

});