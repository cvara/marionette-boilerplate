var App = require('app');
var Utility = require('common/utility');
var commonTpl = require('common/templates/common');


App.module('Common.Views', function(Views, App, Backbone, Marionette, $, _) {

	Views.Common = Marionette.ItemView.extend({
		template: commonTpl
	});

});

module.exports = App.Common.Views;