define([
	'app',
	'backbone.picky'
], function(App) {

	App.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {

		Entities.SidebarItem = Backbone.Model.extend({});

		_.extend(Entities.SidebarItem.prototype, {
			initialize: function(attrs, options) {
				var selectable = new Backbone.Picky.Selectable(this);
				_.extend(this, selectable);
			}
		});

		Entities.SidebarCollection = Backbone.Collection.extend({
			model: Entities.SidebarItem,

			initialize: function(models, options) {
				var singleSelect = new Backbone.Picky.SingleSelect(this);
				_.extend(this, singleSelect);
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

		App.reqres.setHandler('sidebar:entities', function(role) {
			if (role === 'admin') {
				return API.getAdminSidebarElements();
			}
			if (role === 'user') {
				return API.getUserSidebarElements();
			}
		});
	});

	return;
});