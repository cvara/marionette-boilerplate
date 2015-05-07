// NOTE: Only `notify` module returns the PNotify object. The other modules just modify PNotify.prototype.
define(['app', 'pnotify', 'pnotify.buttons', 'pnotify.confirm', 'pnotify.nonblock'], function(App, PNotify) {

	PNotify.prototype.options.styling = 'bootstrap3';

	var stack_topleft = {dir1: 'down', dir2: 'right', push: 'top'};
	var stack_bottomleft = {dir1: 'right', dir2: 'up', push: 'top'};
	var stack_bar_top = {dir1: 'down', dir2: 'right', push: 'top', spacing1: 0, spacing2: 0};
	var default_stack = {dir1: 'down', dir2: 'left', push: 'bottom', spacing1: 25, spacing2: 25, context: $('body')};

	var API = {
		showNotification: function(opts) {
			var options = {
				title: false,
				text: false,
				type: 'notice', // 'notice', 'success', 'info', 'error'
				delay: 8000,
				addclass: 'stack-bar-top',
				cornerclass: '',
				width: '100%',
				animation: 'fade',
				hide: true,
				animate_speed: 'fast',
				stack: stack_bar_top,
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
			_.extend(options, opts);
			new PNotify(options);
		}
	};

	App.commands.setHandler('notify', function(opts) {
		API.showNotification(opts);
	});

	return;
});