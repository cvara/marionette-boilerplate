var App = require('app');
var Utility = require('common/utility');

// NOTE: Only `notify` module returns the PNotify object. The other modules just modify PNotify.prototype.
var PNotify = require('pnotify');
require('pnotify.buttons');
require('pnotify.nonblock');
require('pnotify.callbacks');
require('pnotify.confirm');
require('pnotify.desktop');
require('pnotify.mobile');
require('pnotify.animations');

var Radio = require('backbone.radio');
var GlobalChannel = Radio.channel('global');

// Set styling to bootstrap 3
PNotify.prototype.options.styling = 'bootstrap3';

// Prepare some stacks for convience
var stack_topleft = {dir1: 'down', dir2: 'right', push: 'top'};
var stack_bottomleft = {dir1: 'right', dir2: 'up', push: 'top'};
var stack_bar_top = {dir1: 'down', dir2: 'right', push: 'top', spacing1: 0, spacing2: 0};
var default_stack = {dir1: 'down', dir2: 'left', push: 'bottom', spacing1: 25, spacing2: 25, context: $('body')};

// Shared defaults for all notice types
var globalOpts = {
	title: false,
	text: false,
	type: 'notice', // 'notice', 'success', 'info', 'error'
	delay: 8000,
	// addclass: 'stack-bar-top',
	// stack: stack_bar_top,
	cornerclass: '',
	animate_speed: 500,
	animate: {
		animate: true,
		in_class: 'zoomInLeft',
		out_class: 'zoomOutRight'
	},
	nonblock: {
		nonblock: false,
		nonblock_opacity: 0.2
	},
	buttons: {
		closer: true, // - Provide a button for the user to manually close the notice.
		closer_hover: false, // - Only show the closer button on hover.
		sticker: false, // Provide a button for the user to manually stick the notice.
		sticker_hover: true, // - Only show the sticker button on hover.
		labels: {close: 'Close', stick: 'Stick'}, // - Lets you change the displayed text, facilitating internationalization.
	}
};

var API = {

	showNotification: function(opts) {
		var options = {
			width: 'auto',
			hide: true
		};
		_.extend(options, globalOpts, opts);
		new PNotify(options);
	},

	showConfirmation: function(opts) {
		var options = {
			width: '80%',
			hide: false,
			confirm: {
				confirm: true
			}
		};
		_.extend(options, globalOpts);
		Utility.deepMerge(options, opts);
		return new PNotify(options).get();
	}
};

GlobalChannel.reply('notify', function(opts) {
	API.showNotification(opts);
});

GlobalChannel.reply('confirm', function(opts) {
	return API.showConfirmation(opts);
});
