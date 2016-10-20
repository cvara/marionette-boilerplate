import Mn from 'backbone.marionette';
import aboutTpl from './templates/about';
import faqTpl from './templates/faq';
import termsTpl from './templates/terms';


const View = {};

View.StaticView = Mn.View.extend({
	className: 'container-fluid max-width-xs static-section',
	tagName: 'section',

	getTemplate: function() {
		const view = this.getOption('view');
		switch (view) {
			case 'about' : return aboutTpl;
			case 'faq'   : return faqTpl;
			case 'terms' : return termsTpl;
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
		const selector = $(e.currentTarget).attr('data-target');
		$('html, body').animate({
			scrollTop: $(selector).offset().top - $('#header-section .navbar').outerHeight() - 10
		}, 500);
	}
});


export default View;
