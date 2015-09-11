// Load plugins
var gulp = require('gulp');

var notifier = require('node-notifier');
var util = require('gulp-util');

var LessPluginCleanCss = require('less-plugin-clean-css'),
	cleanCss = new LessPluginCleanCss({
		keepSpecialComments: 0
	});

var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config');
var connect = require('gulp-connect');
var preprocess = require('gulp-preprocess');
var less = require('gulp-less');
var inlinesource = require('gulp-inline-source');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
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

// Error handler
function lessVerboseErrorHandler(err) {
	// Log to console
	util.log(util.colors.red('Error'), err.message);
	// Manually end the stream, so that it can re-run
	this.emit('end');
}

// Connect dev server
gulp.task('connectDev', function() {
	connect.server({
		root: [__dirname],
		port: 8181,
		hostname: '*', // to allow access to server from outside
		livereload: false
	});
});

// Connect server
gulp.task('connect', function() {
	connect.server({
		root: buildPath,
		port: 8080,
		hostname: '*', // to allow access to server from outside
		livereload: true
	});
});

// Copy HTML
gulp.task('copyHtml', function() {
	return gulp.src('./index.html')
		.pipe(preprocess({
			context: {
				NODE_ENV: 'development',
				DEV: true
			}
		}))
		.pipe(gulp.dest(buildPath));
});

// Preprocess HTML
gulp.task('preprocessHtml', function() {
	return gulp.src('./index.html')
		.pipe(preprocess({
			context: {
				NODE_ENV: 'production',
				PROD: true
			}
		}))
		.pipe(inlinesource())
		.pipe(gulp.dest(buildPath));
});

// Styles
gulp.task('styles', function() {
	return gulp.src('./assets/css/style.less')
		// Run the transformation from LESS to CSS & minify
		.pipe(less({
			plugins: [cleanCss]
		}))
		.on('error', errorHandler)
		.pipe(rename({
			basename: 'main',
			suffix: '.min',
		}))
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
		.pipe(gulp.dest(buildPath + '/assets/js'));
});

// Images
gulp.task('images', function() {
	return gulp.src('./assets/img/**/*.*')
		.pipe(imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest(buildPath + '/assets/img/'));
});

// Favicons
gulp.task('favicons', function() {
	return gulp.src('./assets/favicons/*.*')
		.pipe(gulp.dest(buildPath + '/assets/favicons'));
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

// Build (for dev)
gulp.task('build', function(callback) {
	var start = new Date().getTime();
	runSequence('clean', 'webpack', 'styles', ['fonts', 'favicons', 'images'], 'copyHtml', callback);
});

// Build Plus (for prod - takes more time)
gulp.task('buildPlus', function(callback) {
	var start = new Date().getTime();
	runSequence('clean', 'webpack', 'styles', ['fonts', 'favicons', 'images'], 'preprocessHtml', 'uglifyBundle', callback);
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
	runSequence('buildPlus', 'connect', callback);
});

// connectDev task alias
gulp.task('sandbox', function() {
	gulp.start('connectDev');
});

// Default task
gulp.task('default', function() {
	gulp.start('run');
});