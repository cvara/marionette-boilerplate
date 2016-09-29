var App = require('app');
var FormBase = require('common/form.view');
var loginTpl = require('apps/users/login/templates/login');

var View = {};

View.Login = FormBase.extend({
	template: loginTpl
});

module.exports = View;
