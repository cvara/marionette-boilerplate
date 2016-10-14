import App from 'app';
import FormBase from 'common/form.view';
import loginTpl from './templates/login';

var View = {};

View.Login = FormBase.extend({
	template: loginTpl
});

module.exports = View;
