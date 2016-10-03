var App = require('app');
var Mn = require('backbone.marionette');
var splashTpl = require('apps/splash/show/templates/splash');


var View = {};

View.Splash = Mn.View.extend({
	className: 'splash-container',
	template: splashTpl
});

module.exports = View;
