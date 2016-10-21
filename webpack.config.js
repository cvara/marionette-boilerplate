const webpack = require('webpack');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const path = require('path');

const parts = require('./libs/parts');

const TARGET = process.env.npm_lifecycle_event;
const ENABLE_POLLING = process.env.ENABLE_POLLING;
const PATHS = {
	scripts: path.join(__dirname, '/assets/js'),
	favicons: path.join(__dirname, '/assets/favicons'),
	fonts: path.join(__dirname, '/assets/fonts'),
	img: path.join(__dirname, '/assets/img'),
	app: path.join(__dirname, '/assets/js', 'main.js'),
	style: path.join(__dirname, '/assets/css', 'style.less'),
	build: path.join(__dirname, 'dist'),
	test: path.join(__dirname, 'tests')
};
process.env.BABEL_ENV = TARGET;


const common = merge(
	{
		entry: {
			app: PATHS.app
		},

		output: {
			path: PATHS.build,
			filename: '[name].js'
			// TODO: Set publicPath to match your GitHub project name
			// E.g., '/marionette-boilerplate/'. Webpack will alter asset paths
			// based on this. You can even use an absolute path here
			// or even point to a CDN.
			//publicPath: ''
		},

		externals: {
			fb: 'var FB'
		},

		resolve: {
			root: [ PATHS.scripts, PATHS.favicons, PATHS.fonts, PATHS.img ],
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
				'pnotify.confirm': 'vendor/pnotify.confirm',
				'pnotify.animations': 'vendor/pnotify.animations'
			}
		}
	},
	parts.createHtml({
		title: 'Marionette Boilerplate',
		description: 'A starting point for new Marionette based apps',
		fonts: 'https://fonts.googleapis.com/css?family=Open+Sans:400,300,400italic,600,700'
	}),
	parts.provide({
		_: 'underscore',
		$: 'jquery',
		jQuery: 'jquery',
		'window.jQuery': 'jquery',
		'pnotify': 'PNotify'
	}),
	parts.setupChunks({
		minChunkSize: 20 * 1024,
		maxChunks: 1
	}),
	parts.keepMomentLocales(['el', 'en-gb']),
	parts.loadJS(PATHS.scripts),
	parts.loadTpl(),
	parts.loadFavicons(PATHS.favicons)
);

let config;

// Detect how npm is run and branch based on that
switch (TARGET) {

	case 'build':
	case 'stats':
		config = merge(common,
			{
				// Single entry point to output a single bundle
				entry: [
					PATHS.app,
					PATHS.style
				],
				devtool: false,
				output: {
					path: PATHS.build,
					filename: '[name].[chunkhash].js',
					chunkFilename: '[chunkhash].js'
				}
			},
			parts.clean(PATHS.build),
			parts.copy([
				PATHS.img,
				PATHS.fonts,
				PATHS.favicons
			]),
			parts.setFreeVariable('process.env.NODE_ENV', 'production'),
			parts.minify(),
			parts.extractCSS(PATHS.style)
		);
		break;

	case 'test':
	case 'test:tdd':
		config = merge(common,
			{
				entry: {
					app: PATHS.app
				},
				devtool: 'inline-source-map'
			},
			parts.loadIsparta(PATHS.app),
			parts.loadJS(PATHS.test)
		);
		break;

	default:
		config = merge(common,
			{
				entry: {
					style: PATHS.style
				},
				devtool: 'eval-source-map',
			},
			parts.loadCSS(PATHS.style),
			parts.devServer({
				// Customize host/port here if needed
				host: process.env.HOST,
				port: process.env.PORT || 4000,
				poll: ENABLE_POLLING
			})
		);
}

module.exports = validate(config, {
	quiet: true
});
