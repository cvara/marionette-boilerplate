import App from 'app';
import Backbone from 'backbone';
import 'backbone.select';
import Radio from 'backbone.radio';
const GC = Radio.channel('global');


const SidebarItem = Backbone.Model.extend({
	initialize: function(attrs, options) {
		Backbone.Select.Me.applyTo( this );
	}
});

const SidebarCollection = Backbone.Collection.extend({
	model: SidebarItem,

	initialize: function(models, options) {
		Backbone.Select.One.applyTo( this, models, options );
	}
});

// Sidebar elements per user type
const getSidebarItems = {
	admin: () => {
		return new SidebarCollection([{
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

	user: () => {
		return new SidebarCollection([{
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

const API = {
	getAdminSidebarElements: () => {
		return getSidebarItems.admin();
	},
	getUserSidebarElements: () => {
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

export default SidebarCollection;
