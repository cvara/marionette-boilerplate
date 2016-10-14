import App from 'app';
import Mn from 'backbone.marionette';
import headerTpl from './templates/header';


const View = {};

View.Header = Mn.View.extend({
	template: headerTpl,
	tagName: 'div',
	className: 'header',
	id: 'header-view-container',

	ui: {
		brand: '.js-brand',
		memberOnly: '.js-member-only',
		guestOnly: '.js-guest-only',
		roleBound: '[data-role]',
		loginButton: '.js-login',
		logoutButton: '.js-logout'
	},

	triggers: {
		'click @ui.brand': 'show:home',
		'click @ui.loginButton': 'login:user',
		'click @ui.logoutButton': 'logout:user'
	},

	modelEvents: {
		'change': 'modelChanged'
	},

	modelChanged: function() {
		this.render();
	},

	templateContext: function() {
		return {};
	},

	onRender: function() {
		this.toggleMembershipBoundElements();
		this.toggleRoleBoundElements();
	},

	toggleMembershipBoundElements: function() {
		if (!this.model) {
			this.ui.memberOnly.addClass('hidden');
		} else {
			this.ui.guestOnly.addClass('hidden');
		}
		this.toggleRoleBoundElements();
	},

	toggleRoleBoundElements: function() {
		const role = this.model ? this.model.get('role') : 'guest';
		const toShow = this.ui.roleBound.filter('[data-role*="' + role + '"]');
		const toHide = this.ui.roleBound.not(toShow);
		toShow.removeClass('hidden');
		toHide.addClass('hidden');
	}
});


export default View;
