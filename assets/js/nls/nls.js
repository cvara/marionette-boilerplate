var App = require('app');
var Polyglot = require('node-polyglot');


// All supported locales. First is default.
// ==========================================
//
var Locales = [
	{
		full    : 'el',
		legible : 'Ελληνικά',
		lang    : require('./locales/el')
	},
	{
		full    : 'en-gb',
		legible : 'English',
		lang    : require('./locales/en-gb')
	}
];


// Currently guessed / set locale
// ==========================================
//
var guessedLocale = null;


// Default locale
// ==========================================
// Using in failed guess/set locale attempts
var DEFAULT_LOCALE = Locales[0].full;


var API = {

	// Returns guessed locale in all formats
	// ==========================================
	// example:
	// {
	// 	 full: 'en-us',
	// 	 legible: 'English',
	// 	 prefix: 'en'
	// }
	getGuessedLocale: function() {
		var supportedLocales = API.getSupportedLocales();
		var index = _.indexOf(supportedLocales.full, guessedLocale);
		return {
			full: supportedLocales.full[index],
			legible: supportedLocales.legible[index],
			prefix: supportedLocales.prefix[index]
		};
	},

	// Returns supported locales in all formats
	// ==========================================
	//
	getSupportedLocales: function() {
		var supportedLocales = [];
		supportedLocales.full = _.map(Locales, function(locale) {
			return locale.full;
		});
		supportedLocales.legible = _.map(Locales, function(locale) {
			return locale.legible;
		});
		supportedLocales.prefix = _.map(supportedLocales.full, function(locale) {
			return locale.split('-')[0];
		});

		return supportedLocales;
	},

	// Guesses & returns desired locale in full format (i.e. 'en-us')
	// ==========================================
	//
	guessLocale: function() {
		// Get supported locales
		var supportedLocales = API.getSupportedLocales();

		// Try to guess desired locale, falling back to default
		var locale = typeof navigator === 'undefined' && typeof localStorage === 'undefined' ?
			DEFAULT_LOCALE :
			(localStorage.getItem('locale') ||
				navigator.language ||
				navigator.userLanguage || DEFAULT_LOCALE).toLowerCase();

		// If full locale was a match
		if (_.indexOf(supportedLocales.full, locale) !== -1) {
			return locale;
		}

		// If locale prefix was a match
		var index = _.indexOf(supportedLocales.prefix, locale.split('-')[0]);
		if (index !== -1) {
			return supportedLocales.full[index];
		}

		// Nothing was a match, stick to default
		return DEFAULT_LOCALE;
	},

	// Sets up our i18n library to use desired locale
	// ==========================================
	//
	initPolyglot: function(locale) {
		// Init polyglot (register as global var for template access)
		var polyglot = new Polyglot();
		_.bindAll(polyglot, 't');
		window.t = polyglot.t;

		// Get user locale
		guessedLocale = locale || API.guessLocale();

		// Index locales by their 'full' attr
		var indexedLocales = _.indexBy(Locales, 'full');
		// Get language package for guessed locale
		var lang = indexedLocales[guessedLocale].lang;

		// Pass language pack to polyglot
		polyglot.extend(lang);

		console.info('nls: locale set: ', guessedLocale);
	},

	// Main method for setting locale
	// ==========================================
	//
	setLocale: function(locale) {
		// Get supported locales
		var supportedLocales = API.getSupportedLocales();

		// Assume locale is in full format (i.e. 'en-us')
		var index =_.indexOf(supportedLocales.full, locale);

		// Fallback to legible format (i.e. 'English')
		if ( index === -1 ) {
			index = _.indexOf(supportedLocales.legible, locale);
		}

		// Fallback to prefix format (i.e. 'en')
		if ( index === -1 ) {
			index = _.indexOf(supportedLocales.prefix, locale);
		}

		// Fallback to DEFAULT locale
		if ( index === -1 ) {
			index = _.indexOf(supportedLocales.full, DEFAULT_LOCALE);
		}

		var localeToSet = supportedLocales.full[index];

		API.initPolyglot(localeToSet);
		localStorage.setItem('locale', localeToSet);
		App.trigger('nls:locale:changed', API.getGuessedLocale());
	}
};

App.reqres.setHandler('nls:supported:locales', function() {
	return API.getSupportedLocales();
});

App.reqres.setHandler('nls:guess:locale', function() {
	return API.guessLocale();
});

App.reqres.setHandler('nls:current:locale', function() {
	return API.getGuessedLocale();
});

App.reqres.setHandler('nls:init:polyglot', function() {
	return API.initPolyglot();
});

App.reqres.setHandler('nls:set:locale', function(locale) {
	return API.setLocale(locale);
});

module.exports = API;
