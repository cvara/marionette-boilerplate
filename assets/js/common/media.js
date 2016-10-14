// Media Module
// =================
//
// triggers : 'media:screen:size:changed' (size, prevSize)
//            'media:screen:orientation:changed' (orientation, prevOrientation)
//
// replies  : 'media:screen:size' (size <'xs'|'sm'|'md'|'lg'>)
//            'media:orientation:size' (orientation <'L'|'P'>)

import App from 'app';
import Radio from 'backbone.radio';
var GC = Radio.channel('global');


var Media = {};

Media.getScreenSize = function() {
	var winWidth = window.innerWidth;
	if (winWidth < 768) {
		return 'xs';
	}
	if (winWidth < 992) {
		return 'sm';
	}
	if (winWidth < 1200) {
		return 'md';
	}
	return 'lg';
};

Media.getOrientation = function() {
	return window.innerHeight < window.innerWidth ? 'L' : 'P';
};

Media.detectScreenSize = function() {
	// Get screen size (xs|sm|md|lg)
	var screenSize = Media.getScreenSize();

	// If screen size is same as it was during previous execution, exit
	if (screenSize === Media.screenSize) {
		return;
	}

	// Trigger event
	GC.trigger('media:screen:size:changed', screenSize, Media.screenSize);

	// Remember screen size
	Media.screenSize = screenSize;
};

Media.detectOrientation = function() {
	// Get screen orientation (L|P)
	var orientation = Media.getOrientation();
	// If screen orientation is same as it was during previous execution, exit
	if (orientation === Media.orientation) {
		return;
	}
	// Trigger event
	GC.trigger('media:screen:orientation:changed', orientation, Media.orientation);

	// Remember screen orientation
	Media.orientation = orientation;
};

Media.monitorMediaChanges = function() {
	Media.detectScreenSize();
	Media.detectOrientation();
	$(window).on('resize.App.Common.Media', _.debounce(function() {
		Media.detectScreenSize();
		Media.detectOrientation();
	}, 100));
};


// Request Handlers
GC.reply('media:screen:size', function() {
	return Media.screenSize;
});

GC.reply('media:screen:orientation', function() {
	return Media.orientation;
});


// Start monitoring changes
Media.monitorMediaChanges();


module.exports = Media;
