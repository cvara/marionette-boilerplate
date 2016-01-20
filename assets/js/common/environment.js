var Env = window.Env = {};

Env.enableTransforms = true;
Env.enableTransitions = true;

Env.browser = {
	bot: /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent),
	mobile: {
		android: /Android/i.test(navigator.userAgent),
		BlackBerry: /BlackBerry/i.test(navigator.userAgent),
		iOS: /iPhone|iPad|iPod/i.test(navigator.userAgent),
		Windows: /IEMobile/i.test(navigator.userAgent)
	}
};

Env.detectTouch = function() {
	return ('ontouchstart' in window) ||
		(navigator.maxTouchPoints > 0) ||
		(navigator.msMaxTouchPoints > 0);
};

Env.isMobile = {
	Android: function() {
		return Env.browser.mobile.android;
	},
	BlackBerry: function() {
		return Env.browser.mobile.BlackBerry;
	},
	iOS: function() {
		return Env.browser.mobile.iOS;
	},
	Windows: function() {
		return Env.browser.mobile.Windows;
	},
	any: function() {
		return (Env.browser.mobile.android ||
			Env.browser.mobile.BlackBerry ||
			Env.browser.mobile.iOS ||
			Env.browser.mobile.Windows);
	}
};

Env.isMobileApp = function(){
	return document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
};

Env.isBot = function() {
	return Env.browser.bot;
};

Env.cssTransforms = function() {
	var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
	var div = document.createElement('div');
	for (var i = 0; i < prefixes.length; i++) {
		if (div && div.style[prefixes[i]] !== undefined) {
			return true;
			// return prefixes[i];
		}
	}
	return false;
};

Env.addMobileClasses = function() {
	var classes = '';

	if (!Env.isMobile.any()) {
		return;
	}
	classes += ' mobile';

	if (Env.isMobile.Android()) {
		classes += ' Android';
	}
	if (Env.isMobile.BlackBerry()) {
		classes += ' BlackBerry';
	}
	if (Env.isMobile.iOS()) {
		classes += ' iOS';
	}
	if (Env.isMobile.Windows()) {
		classes += ' Windows';
	}
	$('body').addClass(classes);
};

Env.addCss3Classes = function() {
	if (!Env.cssTransforms()) {
		$('body').addClass('no-csstransforms');
		Env.enableTransforms = false;
	}

	if (Env.isMobile.any()) {
		$('body').addClass('no-transitions');
		Env.enableTransitions = false;
	}
};

Env.addEnvironmentClasses = function() {
	Env.addMobileClasses();
	Env.addCss3Classes();
};

module.exports = Env;