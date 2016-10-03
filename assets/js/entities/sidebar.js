var App = require('app');
var Backbone = require('backbone');
require('backbone.select');
var Radio = require('backbone.radio');
var GC = Radio.channel('global');


var SidebarItem = Backbone.Model.extend({});

_.extend(SidebarItem.prototype, {
	initialize: function(attrs, options) {
		Backbone.Select.Me.applyTo( this );
	}
});

var SidebarCollection = Backbone.Collection.extend({
	model: SidebarItem,

	initialize: function(models, options) {
		Backbone.Select.One.applyTo( this, models, options );
	}
});

// Sidebar elements per user type
var getSidebarItems = {
	admin: function() {
		var adminSidebarItems = new SidebarCollection([{
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
		var userSidebarItems = new SidebarCollection([{
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
		return getSidebarItems.admin();
	},
	getUserSidebarElements: function() {
		return getSidebarItems.user();
	}
};

GC.reply('sidebar:entities', function(role) {
	if (role === 'admin') {
		return API.getAdminSidebarElements();
	}
	if (role === 'user') {
		return API.getUserSidebarElements();
	}
});

module.exports = SidebarCollection;
