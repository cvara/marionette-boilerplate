import App from 'app';
import View from './view';

var Controller = {};


Controller.showMainLoader = function() {
    var loaderView = new View.Loader();
    App.rootView.showChildView('loading', loaderView);
};

Controller.hideMainLoader = function() {
    App.rootView.getRegion('loading').empty();
};

Controller.hideAllLoaders = function() {
    App.rootView.getRegion('loading').empty();
};

module.exports = Controller;
