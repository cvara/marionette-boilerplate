/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */

// Load plugins
var gulp = require('gulp'),
	path = require('path'),
	less = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	livereload = require('gulp-livereload'),
	del = require('del');


var distRoot = 'dist-gulp';


// Styles
gulp.task('styles', function() {
	return gulp.src('assets/css/style.less')
		.pipe(less())
		// .pipe(less({
		// 	paths: [path.join(__dirname, 'less', 'includes')]
		// }))
		// .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		// .pipe(gulp.dest('dist/styles'))
		.pipe(rename({
			// dirname: "main/text/ciao",
			basename: 'main',
			// prefix: "bonjour-",
			suffix: '.min',
			// extname: ".md"
		}))
		.pipe(minifycss())
		.pipe(gulp.dest(distRoot + '/assets/css'))
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

// Images
gulp.task('images', function() {
	return gulp.src('src/images/**/*')
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
	del([distRoot + '/assets/css', distRoot + 'dist/assets/js', distRoot + 'dist/assets/img'], cb);
});

// Default task
gulp.task('default', ['clean'], function() {
	gulp.start('styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', function() {

	// Watch .scss files
	gulp.watch('src/styles/**/*.scss', ['styles']);

	// Watch .js files
	gulp.watch('src/scripts/**/*.js', ['scripts']);

	// Watch image files
	gulp.watch('src/images/**/*', ['images']);

	// Create LiveReload server
	livereload.listen();

	// Watch any files in dist/, reload on change
	gulp.watch(['dist/**']).on('change', livereload.changed);

});