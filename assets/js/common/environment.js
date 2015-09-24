var Env = {};

Env.enableTransforms = true;
Env.enableTransitions = true;

Env.detectTouch = function() {
	return ('ontouchstart' in window) ||
		(navigator.maxTouchPoints > 0) ||
		(navigator.msMaxTouchPoints > 0);
};

Env.isMobile = {
	Android: function() {
		return /Android/i.test(navigator.userAgent);
	},
	BlackBerry: function() {
		return /BlackBerry/i.test(navigator.userAgent);
	},
	iOS: function() {
		return /iPhone|iPad|iPod/i.test(navigator.userAgent);
	},
	Windows: function() {
		return /IEMobile/i.test(navigator.userAgent);
	},
	any: function() {
		return (Env.isMobile.Android() ||
			Env.isMobile.BlackBerry() ||
			Env.isMobile.iOS() ||
			Env.isMobile.Windows());
	}
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