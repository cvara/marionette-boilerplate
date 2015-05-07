define([
    'app',
    'apps/loader/show/view'
], function(App, View) {

    App.module('LoaderApp.Show', function(Show, App, Backbone, Marionette, $, _) {

        Show.Controller = {
            showMainLoader: function() {
                var loaderView = new View.Loader();
                App.loadingRegion.show(loaderView);
            },

            hideMainLoader: function() {
                App.loadingRegion.empty();
            },

            hideAllLoaders: function() {
                App.loadingRegion.empty();
                App.loadingMoreRegion.empty();
            }
        };
    });

    return App.LoaderApp.Show.Controller;
});