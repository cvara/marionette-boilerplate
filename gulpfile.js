// Load plugins
var gulp = require('gulp');
var notifier = require('node-notifier');
var util = require('gulp-util');
var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config');
var connect = require('gulp-connect');
var preprocess = require('gulp-preprocess');
var less = require('gulp-less');
var minifycss = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var cache = require('gulp-cache');
var livereload = require('gulp-livereload');
var del = require('del');
var runSequence = require('run-sequence');

var appRoot = __dirname + '/assets';
var buildPath = __dirname + '/dist';

// Error handler
function errorHandler(err) {
	// Native notification
	notifier.notify({
		'title':'Build Error:',
		'message': err.message
	});
	// Log to console
	util.log(util.colors.red('Error'), err.message);
	// Manually end the stream, so that it can re-run
	this.emit('end');
}

// Connect dev server
gulp.task('connectDev', function() {
	connect.server({
		root: './',
		port: 8181,
		hostname: '*', // to allow access to server from outside
		livereload: false
	});
});

// Connect server
gulp.task('connect', function() {
	connect.server({
		root: buildPath,
		port: 8888,
		hostname: '*', // to allow access to server from outside
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
		.on('error', errorHandler)
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

// Build
gulp.task('build', function(callback) {
	var start = new Date().getTime();
	runSequence('clean', 'webpack', ['styles', 'fonts', 'images', 'copyHtml'], callback);
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
	runSequence('build', 'connect', 'watch', callback);
});

// Run in production mode
gulp.task('runProd', function(callback) {
	runSequence('build', 'uglifyBundle', 'connect', callback);
});

// Default task
gulp.task('default', function() {
	gulp.start('run');
});