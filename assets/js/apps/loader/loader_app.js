var App = require('app');
var ShowController = require('apps/loader/show/controller');


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

module.exports = App.LoaderApp;