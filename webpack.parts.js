const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NpmInstallPlugin = require('npm-install-webpack-plugin');


// Auto generates html that will include output bundles
exports.indexTemplate = function(options) {
	return {
		plugins: [
			new HtmlWebpackPlugin({
				template: require('html-webpack-template'),
				title: options.title,
				appMountId: options.appMountId,
				inject: false,
				meta : {
					description: options.description,
					viewport: 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no',
					robots: 'INDEX, FOLLOW'
				},
			})]
	};
};

// DevServer setup
exports.devServer = function(options) {
	const ret = {
		devServer: {
			// Enable history API fallback so HTML5 History API based
			// routing works. This is a good default that will come
			// in handy in more complicated setups.
			historyApiFallback: true,

			// Unlike the cli flag, this doesn't set
			// HotModuleReplacementPlugin!
			hot: true,
			inline: true,

			stats: {
				chunks: false, // Makes the build much quieter
				colors: true
			},

			// Parse host and port from env to allow customization.
			//
			// If you use Vagrant or Cloud9, set
			// host: options.host || '0.0.0.0';
			//
			// 0.0.0.0 is available to all network devices
			// unlike default `localhost`.
			host: options.host, // Defaults to `localhost`
			port: options.port // Defaults to 8080
		},
		plugins: [// Enable multi-pass compilation for enhanced performance
			// in larger projects. Good default.
			new webpack.HotModuleReplacementPlugin({multiStep: true})
		]
	};

	if (options.poll) {
		ret.watchOptions = {
			// Delay the rebuild after the first change
			aggregateTimeout: 300,
			// Poll using interval (in ms, accepts boolean too)
			poll: 1000
		};
	}

	return ret;
};

// Provides common module exports as variables
exports.provide = function(paramsObj) {
	return {
		plugins: [
			// So that we may use the following vars without explicitly requiring the modules
			// NOTE: webpack internally will resolve these vars by requiring the modules
			new webpack.ProvidePlugin(paramsObj)
		]
	};
};

// Output chunk related settings
exports.setupChunks = function(options) {
	return {
		plugins: [
			// Limit the number of generated chunks
			new webpack.optimize.LimitChunkCountPlugin({
				maxChunks: options.maxChunks
			}),
			// Force min chunk size (to merge entry chunk with other chunks)
			new webpack.optimize.MinChunkSizePlugin({
				minChunkSize: options.minChunkSize
			})
		],
	};
};

// Keeps only specified moment locales in bundle (greatly reduces bundle size)
exports.keepMomentLocales = function(locales) {
	if (!locales || !locales.length) {
		return {};
	}
	var keepRegex = new RegExp('^\.\/(' + locales.join('|') + ')$');
	return {
		plugins: [
			// Replace all locale modules required by webpack the ones found in `locales` arg
			// NOTE: this depends on moment placing its locales in  the ./locale folder,
			// relative to the main file
			new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, keepRegex)
		],
	};
};

// Tpl (underscore template) loaders
exports.loadTpl = function(paths) {
	return {
		module: {
			loaders: [
				{
					test: /\.tpl$/,
					loader: 'ejs'
				}
			]
		}
	};
};

// JS loaders
exports.loadJS = function(include) {
	return {
		module: {
			loaders: [
				{
					test: /\.js$/,
					exclude: /(node_modules|bower_components|vendor)/,
					include: include,
					loader: 'babel', // 'babel-loader' is also a legal name to reference
					query: {
						presets: ['es2015'],
						cacheDirectory: '.babel-cache'
					}
				}
			]
		}
	};
};

// LESS & image loaders
exports.setupCSS = function(paths) {
	return {
		module: {
			loaders: [
				{ test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
				// inline base64 URLs for <=8k images, direct URLs for the rest
				{ test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
			]
		}
	};
};

// Extracts CSS during build as standalone CSS file
exports.extractCSS = function(paths) {
	return {
		module: {
			loaders: [
				{
					test: /\.less/,
					loader: ExtractTextPlugin.extract(
						'css?sourceMap!less?sourceMap'
					),
					include: paths
				}
			]
		},
		plugins: [// Output extracted CSS to a file
			new ExtractTextPlugin('[name].[chunkhash].css')
		]
	};
};

// Minifies output
exports.minify = function() {
	return {
		plugins: [
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false
				}
			})
		]
	};
};

// Free variable
exports.setFreeVariable = function(key, value) {
	const env = {};
	env[key] = JSON.stringify(value);

	return {
		plugins: [new webpack.DefinePlugin(env)]
	};
};

// Extracts bundle from output
exports.extractBundle = function(options) {
	const entry = {};
	entry[options.name] = options.entries;

	return {
		// Define an entry point needed for splitting.
		entry: entry,
		plugins: [// Extract bundle and manifest files. Manifest is
			// needed for reliable caching.
			new webpack.optimize.CommonsChunkPlugin({
				names: [
					options.name, 'manifest'
				],

				// options.name modules only
				minChunks: Infinity
			})]
	};
};

// Cleans dir
exports.clean = function(path) {
	return {
		plugins: [new CleanWebpackPlugin([path], {root: process.cwd()})]
	};
};

// Isparta loader for coverage
exports.loadIsparta = function(include) {
	return {
		module: {
			preLoaders: [
				{
					test: /\.(js|jsx)$/,
					loaders: ['isparta-instrumenter'],
					include: include
				}
			]
		}
	};
};

// Auto installs missing required dependencies
exports.npmInstall = function(options) {
	options = options || {};

	return {
		plugins: [new NpmInstallPlugin(options)]
	};
};
