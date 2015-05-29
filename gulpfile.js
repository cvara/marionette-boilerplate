// Load plugins
var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config');
var connect = require('gulp-connect');
var preprocess = require('gulp-preprocess');
var path = require('path');
var less = require('gulp-less');
var minifycss = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var cache = require('gulp-cache');
var livereload = require('gulp-livereload');
var del = require('del');
var runSequence = require('run-sequence');

var appRoot = __dirname + '/assets';
var buildPath = __dirname + '/dist';

// Connect server
gulp.task('connect', function() {
	connect.server({
		root: buildPath,
		port: 8080,
		livereload: true
	});
});

// Copy HTML
gulp.task('copyHtml', function() {
	return gulp.src('./index.html').pipe(gulp.dest(buildPath));
});

// Preprocess HTML
gulp.task('preprocessHtml', function() {
	return gulp.src('./index.html')
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
		.pipe(gulp.dest(buildPath + '/assets/css'))
		.pipe(connect.reload());
});

// Scripts
gulp.task('scripts', function() {
	return gulp.src('./assets/js/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest(buildPath + '/assets/js'))
		.pipe(connect.reload());
});

// Webpack
gulp.task('webpack', function() {
	return gulp.src(appRoot + '/js/main.js')
		.pipe(webpack(webpackConfig))
		.pipe(gulp.dest(buildPath + '/assets/js'))
		.pipe(connect.reload());
});

// Uglify bundle
gulp.task('uglifyBundle', function() {
	return gulp.src(buildPath + '/assets/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest(buildPath + '/assets/js'))
		.pipe(connect.reload());
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
		.pipe(gulp.dest(buildPath + '/assets/fonts'))
		.pipe(connect.reload());
});

// Clean
gulp.task('clean', function(cb) {
	del([buildPath], cb);
});

// Build for dev
gulp.task('buildDev', function(callback) {
	var start = new Date().getTime();
	runSequence(
		'webpack', ['styles', 'fonts', 'images', 'copyHtml'],
		callback);
});

// Build for prod
gulp.task('buildProd', function(callback) {
	var start = new Date().getTime();
	runSequence(
		'clean',
		'buildDev',
		'uglifyBundle',
		callback);
});


// Watch
gulp.task('watch', function() {

	// Watch .less files
	gulp.watch('./assets/css/**/*.less', ['styles']);

	// Watch .js files
	gulp.watch('./assets/js/**/*', ['webpack']);

	// Watch image files
	gulp.watch('./assets/img/**/*', ['images']);

	// Watch font files
	gulp.watch('./assets/fonts/**/*', ['fonts']);

	// // Watch any files in dist/, reload on change
	// gulp.watch([buildPath + '/**']).on('change', function() {
	// 	// console.log('livereload.changed');
	// });
});

// Run in development mode
gulp.task('run', function(callback) {
	runSequence('buildDev', 'connect', 'watch', callback);
});

// Run in production mode
gulp.task('runProd', function(callback) {
	runSequence('buildProd', 'connect', callback);
});

// Default task
gulp.task('default', function() {
	gulp.start('run');
});