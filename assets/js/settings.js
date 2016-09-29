// Global Application Settings
// -------------------------------------------------------------

var Settings = {

	// Enable CORS client-side
	EnableCORS: true,

	// Landing page triggers for each user role
	landingTrigger: {
		'admin' : 'some:trigger',
		'user'  : 'some:other:trigger',
		'guest' : 'splash:show'
	},

	// Routes accessible by guests
	unprotectedURL: /.*/,

	// Global file size limit
	FileSizeLimit: 2 * 1024 * 1024, // 2mb

	// Check if running as mobile app
	MobileApp: document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1,

	DefaultLocale: 'en',

	// Location of the API
	// RootURL: 'http://localhost:3000',
	RootURL: ''
};


// PhoneGap App
if ( Settings.MobileApp ) {
    Settings.RootURL = 'http://server.domain.name.com';
}


module.exports = Settings;
