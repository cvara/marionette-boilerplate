var App = require('app');
require('backbone.select');


App.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {

	Entities.SidebarItem = Backbone.Model.extend({});

	_.extend(Entities.SidebarItem.prototype, {
		initialize: function(attrs, options) {
			Backbone.Select.Me.applyTo( this );
		}
	});

	Entities.SidebarCollection = Backbone.Collection.extend({
		model: Entities.SidebarItem,

		initialize: function(models, options) {
			Backbone.Select.One.applyTo( this, models, options );
		}
	});

	// Sidebar elements per user type
	var initSidebarItems = {
		admin: function() {
			Entities.adminSidebarItems = new Entities.SidebarCollection([{
				name: 'Sidebar El 1',
				iconClass: 'glyphicon glyphicon-stats',
				navigation: {
					trigger: 'some:trigger'
				}
			}, {
				name: 'Sidebar El 2',
				iconClass: 'glyphicon glyphicon-stats',
				navigation: {
					trigger: 'some:other:trigger'
				}
			}, {
				name: 'Sidebar El 3',
				iconClass: 'icomoon icomoon-quill4',
				navigation: {
					trigger: 'yet:another:trigger'
				}
			}]);
		},

		user: function () {
			Entities.userSidebarItems = new Entities.SidebarCollection([{
				name: 'Sidebar El 1',
				iconClass: 'glyphicon glyphicon-stats',
				navigation: {
					trigger: 'some:trigger'
				}
			}, {
				name: 'Sidebar El 2',
				iconClass: 'glyphicon glyphicon-stats',
				navigation: {
					trigger: 'some:other:trigger'
				}
			}, {
				name: 'Sidebar El 3',
				iconClass: 'icomoon icomoon-quill4',
				navigation: {
					trigger: 'yet:another:trigger'
				}
			}]);
		}

	};

	var API = {
		getAdminSidebarElements: function() {
			if (Entities.adminSidebarItems === undefined) {
				initSidebarItems.admin();
			}
			return Entities.adminSidebarItems;
		},
		getUserSidebarElements: function() {
			if (Entities.userSidebarItems === undefined) {
				initSidebarItems.client();
			}
			return Entities.userSidebarItems;
		}
	};

	GlobalChannel.reply('sidebar:entities', function(role) {
		if (role === 'admin') {
			return API.getAdminSidebarElements();
		}
		if (role === 'user') {
			return API.getUserSidebarElements();
		}
	});
});

module.exports = App.Entities.SidebarCollection;
