const webpack = require('webpack');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const path = require('path');

const parts = require('./webpack.parts');

const TARGET = process.env.npm_lifecycle_event;
const ENABLE_POLLING = process.env.ENABLE_POLLING;
const PATHS = {
	app: path.join(__dirname, '/assets/js', 'main.js'),
	style: path.join(__dirname, '/assets/css', 'style.less'),
	build: path.join(__dirname, 'dist'),
	test: path.join(__dirname, 'tests')
};
process.env.BABEL_ENV = TARGET;


console.log(PATHS.style);

const common = merge(
	{
		entry: {
			app: PATHS.app,
			style: PATHS.style
		},

		output: {
			path: PATHS.build,
			filename: '[name].js'
			// TODO: Set publicPath to match your GitHub project name
			// E.g., '/kanban-demo/'. Webpack will alter asset paths
			// based on this. You can even use an absolute path here
			// or even point to a CDN.
			//publicPath: ''
		},

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
			}),
			// Replace all locale modules required by webpack, except el & en-gb
			// NOTE: to remove/add locales edit this line accordingly
			// NOTE: this depends on moment placing its locales in  the ./locale folder,
			// relative to the main file
			new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(el|en-gb)$/)
		],

		externals: {
			fb: 'var FB'
		},

		resolve: {
			root: [
				path.join(__dirname, '/assets/js')
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
	},
	parts.indexTemplate({
		title: 'Marionette Boilerplate',
		appMountId: 'app'
	}),
	parts.loadJS(),
	parts.loadTpl()
);

let config;

// Detect how npm is run and branch based on that
switch (TARGET) {
	case 'build':
	case 'stats':
		config = merge(common,
			{
				devtool: 'source-map',
				output: {
					path: PATHS.build,
					filename: '[name].[chunkhash].js',
					chunkFilename: '[chunkhash].js'
				}
			},
			parts.clean(PATHS.build),
			parts.setFreeVariable('process.env.NODE_ENV', 'production'),
			// parts.extractBundle({
			// 	name: 'vendor',
			// 	entries: ['react', 'react-dom']
			// }),
			parts.minify(),
			parts.extractCSS(PATHS.style)
		);
		break;
	case 'test':
	case 'test:tdd':
		config = merge(common, {
			devtool: 'inline-source-map'
		}, parts.loadIsparta(PATHS.app), parts.loadJSX(PATHS.test));
		break;
	default:
		config = merge(common,
			{
				devtool: 'eval-source-map',
			},
			parts.setupCSS(PATHS.style),
			parts.devServer({
				// Customize host/port here if needed
				host: process.env.HOST,
				port: process.env.PORT || 4000,
				poll: ENABLE_POLLING
			})
			// parts.npmInstall()
		);
}

module.exports = validate(config, {
	quiet: true
});
