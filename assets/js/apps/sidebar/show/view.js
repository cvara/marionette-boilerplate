define([
	'app',
	'tpl!apps/sidebar/show/templates/sidebar',
	'tpl!apps/sidebar/show/templates/sidebar.element'
], function(App, sidebarTpl, sidebarElementTpl) {

	App.module('SidebarApp.Show.View', function(View, App, Backbone, Marionette, $, _) {

		View.SidebarElement = Marionette.ItemView.extend({
			template: sidebarElementTpl,
			tagName: 'li',
			className: 'sidebar-element',

			ui: {
				icon: '.icon'
			},

			events: {
				'click': 'clicked'
			},

			modelEvents: {
				'selected': 'modelSelected',
				'deselected': 'modelDeselected'
			}
		});

		_.extend(View.SidebarElement.prototype, {
			initialize: function(opts) {

			},

			onRender: function() {
				this.ui.icon.addClass(this.model.get('iconClass'));
			},

			modelSelected: function() {
				console.log('modelSelected');
				this.$el.addClass('active');
			},

			modelDeselected: function() {
				this.$el.removeClass('active');
			},

			clicked: function(e) {
				if(!this.model.selected) {
					this.trigger('navigate', this.model);
				}
			}
		});

		View.Sidebar = Marionette.CompositeView.extend({
			tagName: 'div',
			template: sidebarTpl,
			id: 'sidebar-container',
			className: 'navbar-default',
			childView: View.SidebarElement,
			childViewContainer: 'ul',
			childViewOptions: {},

			onRender: function() {
				if (this.collection && this.collection.length > 0) {
					$('#page-wrap').addClass('sidebar');
				}
			},

			onDestroy: function() {
				$('#page-wrap').removeClass('sidebar');
			}
		});
	});

	return App.SidebarApp.Show.View;
});