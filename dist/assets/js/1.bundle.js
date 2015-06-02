webpackJsonp([1],{

/***/ 39:
/***/ function(module, exports, __webpack_require__) {

	var App = __webpack_require__(2);
	var View = __webpack_require__(54);


	App.module('SplashApp.Show', function(Show, App, Backbone, Marionette, $, _) {

		Show.Controller = {
			showSplash: function() {

				var splashView = new View.Splash();

				App.rootView.showChildView('main', splashView);
			}
		};
	});

	module.exports = App.SplashApp.Show.Controller;

/***/ },

/***/ 54:
/***/ function(module, exports, __webpack_require__) {

	var App = __webpack_require__(2);
	var splashTpl = __webpack_require__(70);


	App.module('SplashApp.Show.View', function(View, App, Backbone, Marionette, $, _) {

		View.Splash = Marionette.ItemView.extend({
			className: 'splash-container',
			template: splashTpl
		});
	});

	module.exports = App.SplashApp.Show.View;

/***/ },

/***/ 70:
/***/ function(module, exports, __webpack_require__) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<div class="container-fluid">\r\n	<div class="jumbotron">\r\n		<h1>Hello there!</h1>\r\n		<p>This is the splash page of your new Marionette project</p>\r\n		<p><a class="btn btn-primary btn-lg" href="javascript:void(0);" role="button">Learn more</a></p>\r\n	</div>\r\n</div>';

	}
	return __p
	}

/***/ }

});