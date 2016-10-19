const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NpmInstallPlugin = require('npm-install-webpack-plugin');

exports.indexTemplate = function(options) {
	return {
		plugins: [
			new HtmlWebpackPlugin({
				template: require('html-webpack-template'),
				title: options.title,
				appMountId: options.appMountId,
				inject: false
			})]
	};
};


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

			// Display only errors to reduce the amount of output.
			stats: 'errors-only',

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
			new webpack.HotModuleReplacementPlugin({multiStep: true})]
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

exports.loadJS = function() {
	return {
		module: {
			loaders: [
				{
					test: /\.js$/,
					exclude: /(node_modules|bower_components|vendor)/,
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

exports.setupCSS = function(paths) {
	return {
		module: {
			loaders: [
				{
					test: /\.less$/,
					loaders: ['style', 'css', 'less']
				}
				// ,
				// {
				// 	test: /\.png$/,
				// 	loader: 'url-loader?limit=100000'
				// }, {
				// 	test: /\.jpg$/,
				// 	loader: 'file-loader'
				// }
			]
		}
	};
};

exports.minify = function() {
	return {
		plugins: [new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false
				}
			})]
	};
};

exports.setFreeVariable = function(key, value) {
	const env = {};
	env[key] = JSON.stringify(value);

	return {
		plugins: [new webpack.DefinePlugin(env)]
	};
};

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

exports.clean = function(path) {
	return {
		plugins: [new CleanWebpackPlugin([path], {root: process.cwd()})]
	};
};

exports.extractCSS = function(paths) {
	return {
		module: {
			loaders: [// Extract CSS during build
				{
					test: /\.less/,
					loader: ExtractTextPlugin.extract({ loader: ['css', 'less'], fallbackLoader: 'style-loader' }),
					// include: paths
				}
			]
		},
		plugins: [// Output extracted CSS to a file
			new ExtractTextPlugin('[name].[chunkhash].css')
		]
	};
};

exports.npmInstall = function(options) {
	options = options || {};

	return {
		plugins: [new NpmInstallPlugin(options)]
	};
};
