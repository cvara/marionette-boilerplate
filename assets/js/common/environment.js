class Environment {

	constructor() {
		// browser detection regexes
		this.browser = {
			bot: /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent),
			mobile: {
				// to detect more mobile devices or update detection code extend/update this object
				Android: /Android/i.test(navigator.userAgent),
				BlackBerry: /BlackBerry/i.test(navigator.userAgent),
				iOS: /iPhone|iPad|iPod/i.test(navigator.userAgent),
				Windows: /IEMobile/i.test(navigator.userAgent)
			}
		};

		// decide what to enable
		this.enableTransforms = this.cssTransforms();
		this.enableTransitions = !this.isMobile();

		// add environment classes
		this.addEnvClasses();
	}

	isMobile(type) {
		if (type) {
			return this.browser.mobile[type];
		}
		return Object.keys(this.browser.mobile).reduce((isMobile, mobile) => {
			return isMobile || this.isMobile(mobile);
		}, false);
	}

	detectTouch() {
		return ('ontouchstart' in window) ||
			(navigator.maxTouchPoints > 0) ||
			(navigator.msMaxTouchPoints > 0);
	}

	isMobileApp() {
		return !/^http(s)?:\/\//.test(document.URL);
	}

	isBot() {
		return this.browser.bot;
	}

	cssTransforms() {
		var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
		var div = document.createElement('div');
		for (var i = 0; i < prefixes.length; i++) {
			if (div && div.style[prefixes[i]] !== undefined) {
				return true;
				// return prefixes[i];
			}
		}
		return false;
	}

	addMobileClasses() {
		if (!this.isMobile()) {
			return;
		}

		const classes = Object.keys(this.browser.mobile).reduce((className, mobile) => {
			return `${className} ${this.isMobile(mobile) ? mobile : ''}`;
		}, 'mobile');

		$('body').addClass(classes);
	}

	addCss3Classes() {
		if (!this.cssTransforms()) {
			$('body').addClass('no-csstransforms');
		}

		if (this.isMobile()) {
			$('body').addClass('no-transitions');
		}
	}

	addEnvClasses() {
		this.addMobileClasses();
		this.addCss3Classes();
	}
}

// Environment Singleton
const environment = window.env = new Environment();

export default environment;
