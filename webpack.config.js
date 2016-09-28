var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: {
		main: __dirname + '/assets/js/main'
	},

	output: {
		path: __dirname + '/dist/assets/js',
		publicPath: '/assets/js/',
		filename: '[name].bundle.js'
	},

	module: {
		loaders: [{
			test: /\.tpl$/,
			loader: 'ejs',
		}]
	},

	devtool: 'cheap-source-map',

	plugins: [
		new webpack.ProvidePlugin({
			// So that we may use the following vars without explicitly requiring the modules
			// NOTE: webpack internally will resolve these vars by requiring the modules
			_: 'underscore',
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
			'pnotify': 'PNotify'
		}),
		// Limit the number of generated chunks
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1 // no limit
		}),
		// Force min chunk size (to merge entry chunk with other chunks)
		new webpack.optimize.MinChunkSizePlugin({
			minChunkSize: 20 * 1024 // 20 KB
		})
	],

	externals: {
		fb: 'var FB'
	},

	resolve: {
		root: [
			__dirname + '/assets/js'
		],
		extensions: ['', '.js', '.tpl'],
		alias: {
			// npm backbone.syphon depends on an older backbone version which results in 2
			// backbone versions being bundled by webpack
			'backbone.syphon': 'vendor/backbone.syphon',

			// polyfills
			'rAF-polyfill': 'vendor/rAF-polyfill',
			'date-polyfill': 'vendor/date-polyfill',
			'storage-polyfill': 'vendor/storage-polyfill',
			'trim-polyfill': 'vendor/trim-polyfill',
			'localstorage-polyfill': 'vendor/localstorage-polyfill',
			'console-stub': 'vendor/console.stub',

			// bootstrap-datetimepicker
			'bootstrap-datetimepicker': 'vendor/bootstrap-datetimepicker',

			// pnotify
			pnotify: 'vendor/pnotify.core',
			'pnotify.buttons': 'vendor/pnotify.buttons',
			'pnotify.nonblock': 'vendor/pnotify.nonblock',
			'pnotify.desktop': 'vendor/pnotify.desktop',
			'pnotify.mobile': 'vendor/pnotify.mobile',
			'pnotify.callbacks': 'vendor/pnotify.callbacks',
			'pnotify.confirm': 'vendor/pnotify.confirm'	,
			'pnotify.animations': 'vendor/pnotify.animations'
		}
	}
};
