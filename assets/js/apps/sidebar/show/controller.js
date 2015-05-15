define([
	'app',
	'apps/sidebar/show/view',
	'entities/sidebar',
	'cache/cache'
], function(App, View) {

	App.module('SidebarApp.Show', function(Show, App, Backbone, Marionette, $, _) {

		Show.Controller = {
			showSidebar: function() {
				var user = App.request('cache:get:logged:user');

				console.log('App.SidebarApp: fetched user from cache: ', user);

				var role = user.get('role');

				console.log('App.SidebarApp: user role: ', role);

				var sidebarElements = App.request('sidebar:entities', role);

				var sidebar = new View.Sidebar({
					collection: sidebarElements
				});

				sidebar.on('childview:navigate', function(childView, model) {
					var trigger = model.get('navigation').trigger;
					if (trigger) {
						var opts = model.get('navigation').options;
						console.log('App.SidebarApp: nav trigger: ' + trigger);
						App.trigger(trigger, opts);
					}
				});

				App.rootView.showChildView('sidebar', sidebar);

				// Sidebar monitors changes in user model & re-draws everything
				// in case the `role` property has changed
				sidebar.listenTo(user, 'change', function() {
					if ( _.has(user.changed, 'role') ) {
						Show.Controller.showSidebar();
					}
				});
			},

			hideSidebar: function() {
				App.rootView.getRegion('sidebar').empty();
			},

			activateElement: function(trigger) {
				var user = App.request('cache:get:logged:user');
				if (!user) {
					return;
				}
				var role = user.get('role');
				var sidebarElements = App.request('sidebar:entities', role);

				if (!sidebarElements) {
					console.warn('App.SidebarApp.Show.Controller: No elements found for role: ', role);
					return;
				}

				var elementToActivate = sidebarElements.find(function(element) {
					return element.get('navigation').trigger === trigger;
				});

				if (elementToActivate) {
					// deselect all in case the same model is being selected twice
					sidebarElements.deselect();
					elementToActivate.select();
				}
			},

			deactivateAllElements: function() {
				var user = App.request('cache:get:logged:user');
				if (!user) {
					return;
				}
				var role = user.get('role');
				var sidebarElements = App.request('sidebar:entities', role);
				if (!sidebarElements) {
					console.warn('App.SidebarApp.Show.Controller: No elements found for role: ', role);
					return;
				}
				sidebarElements.deselect();
			}
		};
	});

	return App.SidebarApp.Show.Controller;
});