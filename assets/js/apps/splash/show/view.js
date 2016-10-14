const Mn = require('backbone.marionette');
const splashTpl = require('./templates/splash');


const View = {};

View.Splash = Mn.View.extend({
	className: 'splash-container',
	template: splashTpl
});

export default View;
