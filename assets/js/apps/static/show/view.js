define([
	'app',
	'apps/static/show/templates/about',
	'apps/static/show/templates/faq',
	'apps/static/show/templates/terms',
	'apps/static/show/templates/terms.service',
	'apps/static/show/templates/terms.website',
	'apps/static/show/templates/terms.privacy',
	'apps/static/show/templates/terms.cookies'
], function(
	App,
	aboutTpl,
	writersAndEditorsTpl,
	faqTpl,
	termsTpl,
	termsServiceTpl,
	termsWebsiteTpl,
	termsPrivacyTpl,
	termsCookiesTpl
) {

	App.module('StaticApp.Show.View', function(View, App, Backbone, Marionette, $, _) {

		View.StaticView = Marionette.ItemView.extend({
			className: 'container-fluid max-width-xs static-section',
			tagName: 'section',

			getTemplate: function() {
				var view = this.getOption('view');
				switch (view) {
					case 'about'                     : return aboutTpl;
					case 'writersAndEditors'         : return writersAndEditorsTpl;
					case 'faq'                       : return faqTpl;
					case 'terms'                     : return termsTpl;
					case 'termsService'              : return termsServiceTpl;
					case 'termsWebsite'              : return termsWebsiteTpl;
					case 'termsPrivacy'              : return termsPrivacyTpl;
					case 'termsCookies'              : return termsCookiesTpl;
					default: break;
				}
			},

			ui: {
				internalLink: '[data-target]'
			},

			events: {
				'click @ui.internalLink': 'scrollToTarget'
			},

			scrollToTarget: function(e) {
				var selector = $(e.currentTarget).attr('data-target');
				$('html, body').animate({
					scrollTop: $(selector).offset().top - $('#header-section .navbar').outerHeight() - 10
				}, 500);
			}
		});
	});

	return App.StaticApp.Show.View;
});