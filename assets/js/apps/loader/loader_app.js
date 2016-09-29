var Radio = require('backbone.radio');
var GlobalChannel = Radio.channel('global');
var ShowController = require('apps/loader/show/controller');


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

GlobalChannel.on('loader:main:show', function() {
    API.showMainLoader();
});

GlobalChannel.on('loader:main:hide', function() {
    API.hideMainLoader();
});

GlobalChannel.on('loader:all:hide', function() {
    API.hideAllLoaders();
});

module.exports = API;
