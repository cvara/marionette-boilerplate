import App from 'app';
import Polyglot from 'node-polyglot';
import locales from './locales';
import Radio from 'backbone.radio';
import Settings from 'settings';
const GC = Radio.channel('global');


// All supported locales. First is default.
// ==========================================
//
const Locales = [
	{
		full    : 'el',
		legible : 'Ελληνικά',
		lang    : locales.el
	},
	{
		full    : 'en-gb',
		legible : 'English',
		lang    : locales.en_gb
	}
];


// Currently guessed / set locale
// ==========================================
//
let guessedLocale = null;


// Default locale
// ==========================================
// Using in failed guess/set locale attempts
const DEFAULT_LOCALE = Settings.DefaultLocale || Locales[0].full;


const API = {

	// Returns guessed locale in all formats
	// ==========================================
	// example:
	// {
	// 	 full: 'en-us',
	// 	 legible: 'English',
	// 	 prefix: 'en'
	// }
	getGuessedLocale: () => {
		const supportedLocales = API.getSupportedLocales(true);
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
	getSupportedLocales: (expanded) => {
		if (!expanded) {
			return Locales;
		}
		const supportedLocales = {};
		supportedLocales.full = Locales.map(locale => locale.full);
		supportedLocales.legible = Locales.map(locale => locale.legible);
		supportedLocales.prefix = supportedLocales.full.map(locale => locale.split('-')[0]);
		return supportedLocales;
	},

	// Guesses & returns desired locale in full format (i.e. 'en-us')
	// ==========================================
	//
	guessLocale: () => {
		// Get supported locales
		const supportedLocales = API.getSupportedLocales(true);

		// Try to guess desired locale, falling back to default
		// Guesses are made in this order:
		// 1. localStorage (previously stored locale)
		// 2. navigator
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
	initPolyglot: (locale) => {
		// Init polyglot (register as global var for template access)
		const polyglot = new Polyglot();
		_.bindAll(polyglot, 't');
		window.t = polyglot.t;

		// Index locales by their 'full' attr
		const indexedLocales = _.indexBy(Locales, 'full');
		// Get language package for guessed locale
		const lang = indexedLocales[locale].lang;

		// Pass language pack to polyglot
		polyglot.extend(lang);
	},

	// Main method for setting locale
	// ==========================================
	//
	setLocale: (locale) => {
		// Get user locale
		locale = locale || API.guessLocale();

		// Get supported locales
		const supportedLocales = API.getSupportedLocales(true);

		// Assume locale is in full format (i.e. 'en-us')
		let index =supportedLocales.full.indexOf(locale);

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

		// Update guessed locale
		guessedLocale = localeToSet;

		API.initPolyglot(localeToSet);
		localStorage.setItem('locale', localeToSet);
		GC.trigger('nls:locale:changed', API.getGuessedLocale());

		console.info('nls: locale set: ', localeToSet);

		return API.getGuessedLocale();
	}
};

GC.reply('nls:supported:locales', (expanded) => {
	return API.getSupportedLocales(expanded);
});

GC.reply('nls:get:locale', () => {
	return API.getGuessedLocale();
});

GC.reply('nls:set:locale', (locale) => {
	return API.setLocale(locale);
});

export default API;
