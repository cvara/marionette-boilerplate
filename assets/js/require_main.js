requirejs.config({
	baseUrl: 'assets/js',
	paths: {
		backbone                     : 'vendor/backbone', // UMD (AMD + CommonJS) Compatible
		'backbone.syphon'            : 'vendor/backbone.syphon',
		'backbone.picky'             : 'vendor/backbone.picky',
		'backbone.validation'        : 'vendor/backbone.validation',  // AMD Compatible
		'backbone.paginator'         : 'vendor/backbone.paginator.2.0.0', // UMD (AMD + CommonJS) Compatible
		jquery                       : 'vendor/jquery-2.1.0', // UMD (AMD + CommonJS) Compatible
		'jquery.cookie'              : 'vendor/jquery.cookie', // UMD (AMD + CommonJS) Compatible
		json2                        : 'vendor/json2',
		localstorage                 : 'vendor/backbone.localstorage',
		marionette                   : 'vendor/backbone.marionette.2.4.1', // UMD (AMD + CommonJS) Compatible
		underscore                   : 'vendor/underscore',
		'jquery-easing'              : 'vendor/jquery.easing',
		text                         : 'vendor/text', // AMD Compatible
		tpl                          : 'vendor/tpl', // AMD Compatible
		async                        : 'vendor/async', // AMD Compatible
		spin                         : 'vendor/spin',
		'spin.jquery'                : 'vendor/spin.jquery',
		'rAF-polyfill'               : 'vendor/rAF-polyfill',
		'date-polyfill'              : 'vendor/date-polyfill',
		'storage-polyfill'           : 'vendor/storage-polyfill',
		'trim-polyfill'              : 'vendor/trim-polyfill',
		'localstorage-polyfill'      : 'vendor/localstorage-polyfill',
		'console-stub'               : 'vendor/console.stub',
		bootstrap                    : 'vendor/bootstrap.min',
		pnotify                      : 'vendor/pnotify.core',
		'pnotify.buttons'            : 'vendor/pnotify.buttons',
		'pnotify.confirm'            : 'vendor/pnotify.confirm',
		'pnotify.nonblock'           : 'vendor/pnotify.nonblock',
		moment                       : 'vendor/moment.min', // UMD (AMD + CommonJS) Compatible
		'bootstrap-datetimepicker'   : 'vendor/bootstrap-datetimepicker',
	},

	shim: {
		underscore: {
			exports: '_'
		},
		'backbone.syphon': ['backbone'],
		'backbone.picky': ['backbone'],
		localstorage: ['backbone'],
		'jquery-easing': ['jquery'],
		'spin.jquery': ['spin', 'jquery'],
		bootstrap: ['jquery']
	},

	// confgigure tpl plugin to use .tpl extentions
	tpl: {
		extension: '.tpl' // default = '.html'
	},

	waitSeconds: 20
});

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