var Mn = require('backbone.marionette');
var testTpl = require('./templates/test');


var View = {};

View.Test = Mn.View.extend({
	className: 'test-container',
	template: testTpl
});

module.exports = View;
