// Load plugins
var gulp = require('gulp'),
	connect = require('gulp-connect'),
	path = require('path'),
	less = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	rjs = require('gulp-requirejs'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	livereload = require('gulp-livereload'),
	del = require('del');


var appRoot = 'assets',
	buildPath = 'dist',
	staticRoot = 'static';

// Web server
gulp.task('connectDev', function() {
	connect.server({
		port: 8001,
		livereload: false
	});
});

gulp.task('connectProd', function() {
	connect.server({
		root: 'dist',
		port: 8001,
		livereload: false
	});
});

// Styles
gulp.task('styles', function() {
	return gulp.src('assets/css/style.less')
		.pipe(less())
		// .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		// .pipe(gulp.dest('dist/styles'))
		.pipe(rename({
			// dirname: 'main/text/ciao',
			basename: 'main',
			// prefix: 'bonjour-',
			suffix: '.min',
			// extname: '.md'
		}))
		.pipe(minifycss())
		.pipe(gulp.dest(buildPath + '/assets/css'))
		.pipe(notify({
			message: 'Styles task complete'
		}));
});

// Scripts
gulp.task('scripts', function() {
	return gulp.src('src/scripts/**/*.js')
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('dist/scripts'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/scripts'))
		.pipe(notify({
			message: 'Scripts task complete'
		}));
});

// Requirejs Build
gulp.task('requirejsBuild', function() {
	rjs({
			// Main conf file, NOT relative to baseUrl
			mainConfigFile: 'assets/js/require_main.js',
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
		})
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min',
		}))
		.pipe(gulp.dest(buildPath + '/assets/js')) // pipe it to the output DIR
		.pipe(notify({
			message: 'Require build task complete'
		}));
});

// Images
gulp.task('images', function() {
	return gulp.src('assets/img/**/*')
		.pipe(cache(imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('dist/images'))
		.pipe(notify({
			message: 'Images task complete'
		}));
});

// Clean
gulp.task('clean', function(cb) {
	del([buildPath], cb);
});

// Build everything task
gulp.task('buildAll', ['clean'], function() {
	gulp.start('styles', 'scripts', 'requirejsBuild', 'images');
});

// Default task
gulp.task('default', function() {
	gulp.start('connectDev');
});

// Watch
gulp.task('watch', function() {

	// Watch .less files
	gulp.watch('assets/css/**/*.less', ['styles']);

	// Watch .js files
	gulp.watch('assets/js/**/*.js', ['scripts']);

	// Watch image files
	gulp.watch('assets/img/**/*', ['images']);

	// Create LiveReload server
	livereload.listen();

	// Watch any files in dist/, reload on change
	gulp.watch(['dist/**']).on('change', livereload.changed);

});