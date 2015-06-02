webpackJsonp([1],{

/***/ 40:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(2),
		__webpack_require__(54)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(App, View) {

		App.module('SplashApp.Show', function(Show, App, Backbone, Marionette, $, _) {

			Show.Controller = {
				showSplash: function() {

					var splashView = new View.Splash();

					App.rootView.showChildView('main', splashView);
				}
			};
		});

		return App.SplashApp.Show.Controller;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },

/***/ 54:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(2),
		__webpack_require__(66)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(App, splashTpl) {

		App.module('SplashApp.Show.View', function(View, App, Backbone, Marionette, $, _) {

			View.Splash = Marionette.ItemView.extend({
				className: 'splash-container',
				template: splashTpl
			});
		});

		return App.SplashApp.Show.View;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },

/***/ 66:
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