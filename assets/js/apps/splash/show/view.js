var Mn = require('backbone.marionette');
var splashTpl = require('./templates/splash');


var View = {};

View.Splash = Mn.View.extend({
	className: 'splash-container',
	template: splashTpl
});

module.exports = View;
