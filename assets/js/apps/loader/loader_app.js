var ShowController = require('./show/controller');
var Radio = require('backbone.radio');
var GC = Radio.channel('global');



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

GC.on('loader:main:show', function() {
    API.showMainLoader();
});

GC.on('loader:main:hide', function() {
    API.hideMainLoader();
});

GC.on('loader:all:hide', function() {
    API.hideAllLoaders();
});

module.exports = API;
