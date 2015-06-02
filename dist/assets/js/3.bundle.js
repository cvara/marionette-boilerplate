webpackJsonp([3],{

/***/ 42:
/***/ function(module, exports, __webpack_require__) {

	var App = __webpack_require__(2);
	var View = __webpack_require__(56);


	App.module('StaticApp.Show', function(Show, App, Backbone, Marionette, $, _) {

		Show.Controller = {
			showStaticView: function(args) {
				var view = args.view;
				var staticView = new View.StaticView({
					view: view
				});
				App.rootView.showChildView('main', staticView);
			}
		};
	});

	module.exports = App.StaticApp.Show.Controller;

/***/ },

/***/ 56:
/***/ function(module, exports, __webpack_require__) {

	var App = __webpack_require__(2);
	var aboutTpl = __webpack_require__(67);
	var faqTpl = __webpack_require__(68);
	var termsTpl = __webpack_require__(69);


	App.module('StaticApp.Show.View', function(View, App, Backbone, Marionette, $, _) {

		View.StaticView = Marionette.ItemView.extend({
			className: 'container-fluid max-width-xs static-section',
			tagName: 'section',

			getTemplate: function() {
				var view = this.getOption('view');
				switch (view) {
					case 'about'                     : return aboutTpl;
					case 'faq'                       : return faqTpl;
					case 'terms'                     : return termsTpl;
					default: break;
				}
			},

			ui: {
				internalLink: '[data-target]'
			},

			events: {
				'click @ui.internalLink': 'scrollToTarget'
			},

			scrollToTarget: function(e) {
				var selector = $(e.currentTarget).attr('data-target');
				$('html, body').animate({
					scrollTop: $(selector).offset().top - $('#header-section .navbar').outerHeight() - 10
				}, 500);
			}
		});
	});

	module.exports = App.StaticApp.Show.View;

/***/ },

/***/ 67:
/***/ function(module, exports, __webpack_require__) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<section class="page-header text-center">\r\n	<h2>About Us</h2>\r\n</section>';

	}
	return __p
	}

/***/ },

/***/ 68:
/***/ function(module, exports, __webpack_require__) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<section class="page-header text-center">\r\n	<h2>Frequently Asked Questions</h2>\r\n</section>';

	}
	return __p
	}

/***/ },

/***/ 69:
/***/ function(module, exports, __webpack_require__) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<section class="page-header text-center">\r\n	<h3>App Terms</h3>\r\n</section>\r\n\r\n<section>\r\n	<ul class="list-group text-center">\r\n		<li class="list-group-item"><a href="/#static/termsWebsite">Website Terms and Conditions</a></li>\r\n		<li class="list-group-item"><a href="/#static/termsPrivacy">Privacy Policy</a></li>\r\n		<li class="list-group-item"><a href="/#static/termsCookies">Cookie Policy</a></li>\r\n		<li class="list-group-item"><a href="/#static/termsService">Terms of Service</a></li>\r\n	</ul>\r\n</section>\r\n';

	}
	return __p
	}

/***/ }

});