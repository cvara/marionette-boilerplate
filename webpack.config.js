var webpack = require('webpack');

module.exports = {
	entry: [
		__dirname + '/assets/js/main'
	],

	output: {
		path: __dirname + '/dist/assets/js',
		publicPath: '/assets/js/',
		filename: 'bundle.js'
	},

	module: {
		loaders: [{
			test: /\.tpl$/,
			loader: 'ejs'
		}]
	},

	plugins: [
		// This replaces shim stuff in RequireJS.
		new webpack.ProvidePlugin({
			_: 'underscore',
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
			'Marionette': 'marionette',
			'Mn': 'marionette',
			'pnotify': 'PNotify'
		}),
		// Limit the number of generated chunks
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 10
		}),
		// Force min chunk size (to merge entry chunk with other chunks)
		new webpack.optimize.MinChunkSizePlugin({
			minChunkSize: 20 * 1024 // 20 KB
		})
	],

	resolve: {
		root: [
			__dirname + '/assets/js'
		],
		extensions: ['', '.js', '.tpl'],
		alias: {
			backbone: 'vendor/backbone', // UMD (AMD + CommonJS) Compatible
			'backbone.syphon': 'vendor/backbone.syphon',
			'backbone.picky': 'vendor/backbone.picky',
			'backbone.validation': 'vendor/backbone.validation', // AMD Compatible
			'backbone.paginator': 'vendor/backbone.paginator.2.0.0', // UMD (AMD + CommonJS) Compatible
			jquery: 'vendor/jquery-2.1.0', // UMD (AMD + CommonJS) Compatible
			'jquery.cookie': 'vendor/jquery.cookie', // UMD (AMD + CommonJS) Compatible
			json2: 'vendor/json2',
			localstorage: 'vendor/backbone.localstorage',
			marionette: 'vendor/backbone.marionette.2.4.1', // UMD (AMD + CommonJS) Compatible
			underscore: 'vendor/underscore',
			'jquery-easing': 'vendor/jquery.easing',
			text: 'vendor/text', // AMD Compatible
			tpl: 'vendor/tpl', // AMD Compatible
			async: 'vendor/async', // AMD Compatible
			spin: 'vendor/spin',
			'spin.jquery': 'vendor/spin.jquery',
			'rAF-polyfill': 'vendor/rAF-polyfill',
			'date-polyfill': 'vendor/date-polyfill',
			'storage-polyfill': 'vendor/storage-polyfill',
			'trim-polyfill': 'vendor/trim-polyfill',
			'localstorage-polyfill': 'vendor/localstorage-polyfill',
			'console-stub': 'vendor/console.stub',
			bootstrap: 'vendor/bootstrap.min',
			pnotify: 'vendor/pnotify.core',
			'pnotify.buttons': 'vendor/pnotify.buttons',
			'pnotify.confirm': 'vendor/pnotify.confirm',
			'pnotify.nonblock': 'vendor/pnotify.nonblock',
			'bootstrap-datetimepicker': 'vendor/bootstrap-datetimepicker',
		}
	}
};