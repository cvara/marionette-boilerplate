// All polyfills gathered here for convenience
define('all-polyfills', [
	'rAF-polyfill',
	'date-polyfill',
	'storage-polyfill',
	'trim-polyfill',
	'localstorage-polyfill',
	'json2',
	'console-stub'
], function() {
	return;
});


// IMPORTANT: we require the header & sidebar apps before starting our main app,
// because they register handlers for the application 'start' event
require([
	'app',
	'apps/header/header_app',
	'apps/sidebar/sidebar_app',
	'apps/loader/loader_app',
	'all-polyfills',
	'bootstrap',
	'moment'
], function(App) {
	console.clear();
	App.start();
	console.info('App Started.');
});