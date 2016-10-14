import Settings from 'settings';

// Async fetch script with jquery
var fbUrl = '//connect.facebook.net/en_US/sdk.js';
var fetchingFB = $.getScript(fbUrl).done(function() {
	// Init Facebook Share
	window.FB.init(Settings.FBApp);
});


var Share_Util = window.Share_Util = {
	openPopup: function(url, w, h) {
		w = w || 920;
		h = h || 436;
		var left = (screen.width/2)-(w/2);
		var top = (screen.height/2)-(h/2);
		var popupFeatures = 'left=' + left + ',top=' + top + ',resizable=yes,scrollbars=no,';
		popupFeatures += 'status=0,toolbar=0,width=' + w + ',height=' + h;
		window.open(url, 'Share', popupFeatures);
	},
	openFBShare: function(url, title, caption, text, img) {
		// Make sure the FB script has been fetched
		if (fetchingFB.state() !== 'resolved') {
			console.log('FB not fetched: will try again...');
			setTimeout(function() {
				Share_Util.openFBShare(url, title, caption, text, img);
			}, 300);
			return;
		}

		window.FB.ui({
				method: 'feed',
				name: title,
				caption: caption,
				description: text,
				link: url,
				picture: /fbcdn/.test(img) ? '' : img
			}
		);
	},
	generateTwitterUrl: function(url, text) {
		/**
		 * Example:
		 * https://twitter.com/share?url={url}&text={title}&via={via}&hashtags={hashtags}
		 */
		return 'https://twitter.com/share?url=' + url + '&text=' + text + ' (via @MarionetteApp)';
	},
	generateGoogleUrl: function(url) {
		/**
		 * Example:
		 * https://plus.google.com/share?url={url}
		 */
		return 'https://plus.google.com/share?url=' + url;
	}
};

module.exports = window.Share_Util ;
