var App = require('app');
var View = require('apps/loader/show/view');


App.module('LoaderApp.Show', function(Show, App, Backbone, Marionette, $, _) {

    Show.Controller = {
        showMainLoader: function() {
            var loaderView = new View.Loader();
            App.rootView.showChildView('loading', loaderView);
        },

        hideMainLoader: function() {
            App.rootView.getRegion('loading').empty();
        },

        hideAllLoaders: function() {
            App.rootView.getRegion('loading').empty();
        }
    };
});

module.exports = App.LoaderApp.Show.Controller;