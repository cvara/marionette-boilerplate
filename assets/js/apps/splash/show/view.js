var App = require('app');
var Marionette = require('backbone.marionette');
var splashTpl = require('apps/splash/show/templates/splash');


var View = {};

View.Splash = Marionette.View.extend({
	className: 'splash-container',
	template: splashTpl
});

module.exports = View;
