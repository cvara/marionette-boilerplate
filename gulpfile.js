// Load plugins
var gulp = require('gulp');
var connect = require('gulp-connect');
var path = require('path');

// Connect server
gulp.task('connect', function() {
	connect.server({
		root: path.join(__dirname, '/dist'),
		port: 8080,
		hostname: '*', // to allow access to server from outside
		livereload: false
	});
});
