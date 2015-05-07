define([
	'app',
	'common/utility',
	'tpl!common/templates/common'
], function(
	App,
	Utility,
	commonTpl
) {

	App.module('Common.Views', function(Views, App, Backbone, Marionette, $, _) {

		Views.Common = Marionette.ItemView.extend({
			template: commonTpl
		});

	});

	return App.Common.Views;
});