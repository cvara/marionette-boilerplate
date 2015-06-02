define([
	'app',
	'apps/header/show/templates/header',
], function(App, headerTpl) {

	App.module('HeaderApp.Show.View', function(View, App, Backbone, Marionette, $, _) {

		View.Header = Marionette.ItemView.extend({
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

			templateHelpers: function() {
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
				var role = this.model ? this.model.get('role') : 'guest';
				var toShow = this.ui.roleBound.filter('[data-role*="' + role + '"]');
				var toHide = this.ui.roleBound.not(toShow);
				toShow.removeClass('hidden');
				toHide.addClass('hidden');
			}
		});
	});

	return App.HeaderApp.Show.View;
});