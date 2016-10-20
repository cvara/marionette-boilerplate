import App from 'app';
import Polyglot from 'node-polyglot';
import Radio from 'backbone.radio';
const GC = Radio.channel('global');


// All supported locales. First is default.
// ==========================================
//
const Locales = [
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
let guessedLocale = null;


// Default locale
// ==========================================
// Using in failed guess/set locale attempts
const DEFAULT_LOCALE = Locales[0].full;


const API = {

	// Returns guessed locale in all formats
	// ==========================================
	// example:
	// {
	// 	 full: 'en-us',
	// 	 legible: 'English',
	// 	 prefix: 'en'
	// }
	getGuessedLocale: function() {
		const supportedLocales = API.getSupportedLocales();
		const index = supportedLocales.full.indexOf(guessedLocale);
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
		const supportedLocales = {};

		supportedLocales.full = Locales.map(locale => locale.full);
		supportedLocales.legible = Locales.map(locale => locale.legible);
		supportedLocales.prefix = supportedLocales.full.map(locale => locale.split('-')[0]);

		return supportedLocales;
	},

	// Guesses & returns desired locale in full format (i.e. 'en-us')
	// ==========================================
	//
	guessLocale: function() {
		// Get supported locales
		const supportedLocales = API.getSupportedLocales();

		// Try to guess desired locale, falling back to default
		const locale = typeof navigator === 'undefined' && typeof localStorage === 'undefined' ?
			DEFAULT_LOCALE :
			(localStorage.getItem('locale') ||
				navigator.language ||
				navigator.userLanguage || DEFAULT_LOCALE).toLowerCase();

		// If full locale was a match
		if (supportedLocales.full.indexOf(locale) !== -1) {
			return locale;
		}

		// If locale prefix was a match
		const index = supportedLocales.prefix.indexOf(locale.split('-')[0]);
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
		const polyglot = new Polyglot();
		_.bindAll(polyglot, 't');
		window.t = polyglot.t;

		// Get user locale
		guessedLocale = locale || API.guessLocale();

		// Index locales by their 'full' attr
		const indexedLocales = _.indexBy(Locales, 'full');
		// Get language package for guessed locale
		const lang = indexedLocales[guessedLocale].lang;

		// Pass language pack to polyglot
		polyglot.extend(lang);

		console.info('nls: locale set: ', guessedLocale);
	},

	// Main method for setting locale
	// ==========================================
	//
	setLocale: function(locale) {
		// Get supported locales
		const supportedLocales = API.getSupportedLocales();

		// Assume locale is in full format (i.e. 'en-us')
		let index = supportedLocales.full.indexOf(locale);

		// Fallback to legible format (i.e. 'English')
		if ( index === -1 ) {
			index = supportedLocales.legible.indexOf(locale);
		}

		// Fallback to prefix format (i.e. 'en')
		if ( index === -1 ) {
			index = supportedLocales.prefix.indexOf(locale);
		}

		// Fallback to DEFAULT locale
		if ( index === -1 ) {
			index = supportedLocales.full.indexOf(DEFAULT_LOCALE);
		}

		const localeToSet = supportedLocales.full[index];

		API.initPolyglot(localeToSet);
		localStorage.setItem('locale', localeToSet);
		GC.trigger('nls:locale:changed', API.getGuessedLocale());
	}
};

GC.reply('nls:supported:locales', () => {
	return API.getSupportedLocales();
});

GC.reply('nls:current:locale', () => {
	return API.getGuessedLocale();
});

GC.reply('nls:set:locale', locale =>
	API.setLocale(locale)
);

module.exports = API;
