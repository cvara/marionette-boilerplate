var App = require('app');
var FormBase = require('common/form.view');
var loginTpl = require('apps/users/login/templates/login');


App.module('UsersApp.Login.View', function(View, App, Backbone, Marionette, $, _) {

	View.Login = FormBase.extend({
		template: loginTpl
	});
});

module.exports = App.UsersApp.Login.View;