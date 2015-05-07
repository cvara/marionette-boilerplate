// The controller is a top level requirement
define(['app', 'apps/loader/show/controller'], function(App, ShowController) {

    App.module('LoaderApp', function(LoaderApp, App, Backbone, Marionette, $, _) {

        var API = {
            showMainLoader: function() {
                ShowController.showMainLoader();
            },
            hideMainLoader: function() {
                ShowController.hideMainLoader();
            },
            hideAllLoaders: function() {
                ShowController.hideAllLoaders();
            }
        };

        App.on('loader:main:show', function() {
            API.showMainLoader();
        });

        App.on('loader:main:hide', function() {
            API.hideMainLoader();
        });

        App.on('loader:all:hide', function() {
            API.hideAllLoaders();
        });
    });

    return App.LoaderApp;
});