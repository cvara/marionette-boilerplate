define([
	'app',
	'common/form.view',
	'ejs!apps/users/login/templates/login'
], function(App, FormBase, loginTpl) {

	App.module('UsersApp.Login.View', function(View, App, Backbone, Marionette, $, _) {

		View.Login = FormBase.extend({
			template: loginTpl
		});
	});

	return App.UsersApp.Login.View;
});