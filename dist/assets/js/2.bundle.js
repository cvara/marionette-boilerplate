webpackJsonp([2],{

/***/ 40:
/***/ function(module, exports, __webpack_require__) {

	var App = __webpack_require__(2);
	var View = __webpack_require__(53);
	var Authenticate = __webpack_require__(49);
	var Cache = __webpack_require__(6);
	var Notify = __webpack_require__(3);


	App.module('UsersApp.Login', function(Login, App, Backbone, Marionette, $, _) {

		Login.Controller = {
			showLogin: function() {

				var loginView = new View.Login();

				loginView.on('submit', function(data) {
					console.log(data);
					loginView.triggerMethod('clear:validation:errors');
					loginView.triggerMethod('show:preloader');
					// Log user in
					var authenticating = Authenticate.login(data);
					authenticating.done(function(response) {

					});
					authenticating.fail(function() {

					});
				});

				loginView.on('cancel', function() {
					App.showLanding();
				});

				App.rootView.showChildView('main', loginView);
			}
		};
	});

	module.exports = App.UsersApp.Login.Controller;

/***/ },

/***/ 53:
/***/ function(module, exports, __webpack_require__) {

	var App = __webpack_require__(2);
	var FormBase = __webpack_require__(60);
	var loginTpl = __webpack_require__(66);


	App.module('UsersApp.Login.View', function(View, App, Backbone, Marionette, $, _) {

		View.Login = FormBase.extend({
			template: loginTpl
		});
	});

	module.exports = App.UsersApp.Login.View;

/***/ },

/***/ 60:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, _) {// Form View
	//
	// ==========
	//
	// This is a high level View that handles the most common form-related tasks,
	// such as showing/hiding validation errors, handling file uploads, custom inputs
	// and emitting common events, such as 'submit' & 'cancel'.
	//
	// Uses Backnone.Syphon to easily consume form data and the bootstrap-datetimepicker
	// extension for easily turning common inputs into date-time pickers.
	//
	// The View's main purpose is to be extended by child views, but can also used as a
	// standalone constructor.
	//
	var Marionette = __webpack_require__(21);
	var App = __webpack_require__(2);
	var syphon = __webpack_require__(72);
	var bootstrapDatetimepicker = __webpack_require__(73);


	// Useful data attributes
	var attributes = {
		// Inputs (commonly radios or checkboxes) that toggle custom input
		// Data attribute value is the selector of the element to be toggled
		customToggler : 'data-custom-toggler',

		// Comma seperated inputs to be parsed as arrays
		arrayInput    : 'data-parse-as-array',

		// Select limit (for files & checkboxes)
		selectLimit   : 'data-select-limit',

		// Inputs that are of date-time format
		dateTime      : 'data-datetime'
	};

	// Common selectors gathered here for convenient customizing
	var selectors = {
		formGroup       : '.form-group',
		submitButton    : '.btn-submit',
		cancelButton    : '.btn-cancel',
		fileButton      : '.file-upload',
		preloader       : '.preloader',
		validationError : '.validation-error',
		filePreviewList : 'ul.file-preview-list'
	};

	// Common conditional classes gathered here for convenient customizing
	var conditionalClasses = {
		hidden              : 'hidden',
		formWithErrors      : 'has-errors',
		formGroupWithErrors : 'has-error'
	};


	// accepted types are 'any', document', 'image',
	// or any comma-separated combination of the above
	var validateFile = function(type, file) {
		console.log('Validating file: ', file);
		var regex = {
			type: {
				'any': /.*/igm,
				'document': /pdf|msword|officedocument\.word|opendocument\.text/igm,
				'image': /image\/(jpeg|png|gif)/igm
			},
			suffix: {
				'any': /.*/igm,
				'document': /(\.pdf$)|(\.doc$)|(\.docx$)|(\.odt$)/igm,
				'image': /(\.jpe?g$)|(\.png$)|(\.gif$)/igm
			}
		};

		type = type.split(',');
		for (var i=0, len=type.length; i < len; i++) {
			var curType = $.trim(type[i]);
			if (
				(regex.type[curType] && regex.type[curType].test(file.type)) ||
				(regex.suffix[curType] && regex.suffix[curType].test(file.name))
			) {
				return true;
			}
		}
		return false;
	};

	module.exports = Marionette.ItemView.extend({
		// Child views are allowed to have their own `ui` hash
		_ui: {
			form            : 'form',
			namedElements   : '[name]',
			formGroup       : selectors.formGroup,
			submitButton    : selectors.submitButton,
			cancelButton    : selectors.cancelButton,
			preloader       : selectors.preloader,
			validationError : selectors.validationError,
			customToggler   : '[' + attributes.customToggler + ']',
			arrayInput      : '[' + attributes.arrayInput + ']',
			limitedCheckbox : selectors.formGroup + '[' + attributes.selectLimit + '] [type=checkbox]',
			fileButton      : selectors.fileButton,
			fileInput       : 'input[type=file]',
			input           : 'input',
			datetimeInput   : '[' + attributes.dateTime + ']'
		},

		// Child views are *not* allowed to have their own `events` hash. See `constructor` below
		events: {
			'click @ui.submitButton' : 'submitForm',
			'click @ui.cancelButton' : 'cancelForm',
			'click @ui.fileButton'   : 'triggerFileBrowse',
			'change @ui.fileInput'   : 'handleFileSelect',
			'keypress @ui.input'     : 'submitOnEnter'
		},

		constructor: function() {
			// Note on extending `events`
			// --------------------------------------------------------
			// *ultra weird* bug that occurs when:
			// 1. a child view A extend this view
			// 2. A gets rendered
			// 3. another child view B extends this view
			// 4. B gets rendered
			// 5. on B.triggerMethod('clear:validation:errors')
			//    this.ui is not bound (contains plain string selectors
			//	  and not jQuery objects)
			// Ultra weird because at B.on('show'), this.ui is bound.
			// Solution -> don't extend `_events`, and don't allow child
			// views to specify their own `event` hashes.
			// --------------------------------------------------------
			// this.events = _.extend({}, this._events, this.events);
			// extend parent this._ui with child this.ui
			this.ui = _.extend({}, this._ui, this.ui);

			// Hash containing selected files for each input
			// Keys are input names
			// NOTE: we are storing it inside each *new instance* created
			this._files = {};

			// Avoid onRender shadowing
			this.on('render', function() {
				this.applyCheckboxLimit();
				this.bindCustomInputTogglers();
				this.initDatetimePicker();
			});

			// Avoid onBeforeDestroy shadowing
			this.on('before:destroy', function() {
				console.log('before:destroy ', this, this._files);
				this.ui.namedElements.off();
			});

			// Call the constructor of the super class
			Marionette.ItemView.prototype.constructor.apply(this, arguments);
		},

		onShowPreloader: function() {
			this.ui.submitButton.addClass(conditionalClasses.hidden);
			this.ui.preloader.removeClass(conditionalClasses.hidden);
		},

		onHidePreloader: function() {
			this.ui.preloader.addClass(conditionalClasses.hidden);
			this.ui.submitButton.removeClass(conditionalClasses.hidden);
		},

		onClearValidationErrors: function() {
			this.ui.form.removeClass(conditionalClasses.formWithErrors);
			this.ui.formGroup.removeClass(conditionalClasses.formGroupWithErrors);
			this.ui.validationError.addClass(conditionalClasses.hidden).empty();
		},

		_getBracketNotation: function(dottedProperty) {
			var propArray = dottedProperty.split('.');
			return propArray.reduce(function(previousValue, currentValue, index, array) {
				var reducedValue;
				if (index > 1) {
					reducedValue = previousValue + '][' + currentValue;
				} else {
					reducedValue = previousValue + '[' + currentValue;
				}
				if (index === array.length - 1){
					reducedValue = reducedValue + ']';
				}
				return reducedValue;
			});
		},

		// Accepts validation errors for nested object in dot notation
		// which then converts to bracket notation
		// e.g. user.first_name -> user[first_name]
		_showValidationErrors: function(errors) {
			var self = this;
			_.each(errors, function(value, prop) {
				// recursively handle nested objects
				if (value instanceof Object) {
					self._showValidationErrors(value);
				}
				// show errors inside form
				else {
					// convert dotted properties to bracket notation
					var bracketedProp = self._getBracketNotation(prop);
					var matchSelector;
					// attempt an exact match
					var matchEl = self.$el.find('[name="' + bracketedProp + '"]');
					// no exact match, be more generous
					if (matchEl.length === 0) {
						matchEl = self.$el.find('[name^="' + bracketedProp + '"]');
					}
					var parent = matchEl.closest(selectors.formGroup);
					parent.addClass(conditionalClasses.formGroupWithErrors);
					parent.find(selectors.validationError).html(value).removeClass(conditionalClasses.hidden);
				}
			});
			$('html, body').animate({ scrollTop: 0 });
		},

		onShowValidationErrors: function(errors) {
			if (!errors || errors.length === 0) {
				return;
			}
			this.triggerMethod('clear:validation:errors');
			this.triggerMethod('show:main:form:error');
			this._showValidationErrors(errors);
		},

		onShowMainFormError: function() {
			this.ui.form.addClass(conditionalClasses.formWithErrors);
		},

		applyCheckboxLimit: function() {
			this.ui.limitedCheckbox.on('change', function(e) {
				var el = $(e.target);
				var groupContainer = el.closest(selectors.formGroup);
				var limit = parseInt(groupContainer.attr(attributes.selectLimit), 10);
				var checkedInGroup = groupContainer.find('input[type=checkbox]:checked');
				if (limit > 0 && checkedInGroup.length > limit) {
					el.prop('checked', false);
					e.preventDefault();
				}
			});
		},

		bindCustomInputTogglers: function() {
			var self = this;

			var toggleCustomInput = function(toggler, togglable) {
				if (toggler.prop('checked') || toggler.prop('selected') ) {
					togglable.removeClass(conditionalClasses.hidden).focus();
				}
				else {
					togglable.addClass(conditionalClasses.hidden);
				}
			};

			self.ui.customToggler.each(function() {
				var toggler = $(this);
				var parentFormGroup = toggler.closest(selectors.formGroup);
				var togglableName = toggler.attr(attributes.customToggler);
				var togglable = self.$el.find('[name=' + togglableName + ']');

				// toggle custom input when bound toggler is checked/unchecked
				if (/option/i.test(toggler.prop('tagName'))) {
					// option togglers
					var select = toggler.closest('select');
					select.on('change', function(e) {
						toggleCustomInput(toggler, togglable);
					});
				}
				if (/input/i.test(toggler.prop('tagName'))) {
					// radio & checkbox togglers
					var toggerName = toggler.attr('name').split('[')[0];
					var togglerGroup = parentFormGroup.find('[name^=' + toggerName + ']');
					togglerGroup.on('change', function(e) {
						toggleCustomInput(toggler, togglable);
					});
				}

				// bind toggler value with togglable value
				togglable.on('keypress keydown keyup', function(e) {
					toggler.val(togglable.val());
				});
			});
		},

		_consumeCustomInputs: function(data) {
			var parsed = _.extend({}, data);
			// For radio buttons, checkboxes & select options with custom togglers:
			// replace toggler value with with togglabe input value
			var self = this;
			self.ui.customToggler.each(function() {
				var toggler = $(this);
				var togglableName = toggler.attr(attributes.customToggler); // data-custom-toggler="custom-length"
				var togglable = self.$el.find('[name=' + togglableName + ']');
				var value = toggler.val(); // value="200"
				var name = toggler.attr('name'); // name="length"
				var bracketRegEx = /([\s\S]+)\[([\s\S]+)\]/;
				// toggler name contains brackets => nested syphon attributes => multiple checkboxes
				if (bracketRegEx.test(name)) {
					var matches = name.match(bracketRegEx);
					_.each(parsed[matches[1]], function(value, key) {
						if (key === matches[2] && value === true) {
							if (togglable.val().length > 0) {
								parsed[matches[1]][togglable.val()] = true;
							}
							delete parsed[matches[1]][key];
						}
					});
				}
				// toggler name does not contain brackets => simple radio, checkbox or select option
				else {
					delete parsed[togglableName];
				}
			});
			return parsed;
		},

		_consumeCheckboxGroups: function(data) {
			var parsed = _.extend({}, data);
			var self = this;
			// For checkboxes with multiple select parse them as an array of values
			// ['value1', 'value2', 'value3'] instead of { value1: true, value2: true, value3: true }
			_.each(parsed, function(value, key){
				// look for nested objects
				if(value instanceof Object) {
					// make sure nested objects are bound to checkbox inputs
					var relatedInput = self.$el.find('[name^=' + key + ']');
					if ('checkbox' === relatedInput.attr('type') &&
						typeof relatedInput.attr('data-parse-as-dictionary') === 'undefined') {
						var keys =_.map(value, function(num, key) {
							if (num === true) {
								return key;
							}
							else {
								return false;
							}
						});
						keys = _.reject(keys, function(key) {
							return key === false;
						});
						parsed[key] = keys;
					}
				}
			});
			return parsed;
		},

		_consumeArrayData: function(data) {
			var parsed = _.extend({}, data);
			this.ui.arrayInput.each(function() {
				var name = $(this).attr('name');
				if (!name || !parsed[name]) {
					return true;
				}
				var csv = parsed[name];
				var array = csv.split(/[,\s]/).map(function(value) {
					return $.trim(value);
				});
				array = _.reject(array, function(value) {
					return value.length === 0;
				});
				parsed[name] = array;
			});
			return parsed;
		},

		_consumeFiles: function(data) {
			var parsed = _.extend({}, data);
			var self = this;
			this.ui.fileInput.each(function() {
				var name = $(this).attr('name');
				if (!name) {
					return true;
				}
				if (name in self._files) {
					var boundFiles = self._files[name].map(function(file) {
						return file.file;
					});
					parsed[name] = boundFiles;
				} else {
					parsed[name] = [];
				}
			});
			return parsed;
		},

		_consumeDates: function(data) {
			var parsed = _.extend({}, data);
			var self = this;
			this.ui.datetimeInput.each(function() {
				var name = $(this).attr('name');
				if (!!name && name in data) {
					parsed[name] = moment.utc(parsed[name]).format();
				}
			});
			return parsed;
		},

		consumeFormData: function() {
			var data = Backbone.Syphon.serialize(this);
			data = this._consumeCustomInputs(data);
			data = this._consumeCheckboxGroups(data);
			data = this._consumeArrayData(data);
			data = this._consumeFiles(data);
			data = this._consumeDates(data);
			return data;
		},

		submitForm: function(e) {
			e.preventDefault();
			var data = this.consumeFormData();
			this.trigger('submit', data);
		},

		cancelForm: function(e) {
			e.preventDefault();
			this.trigger('cancel');
		},

		triggerFileBrowse: function(e) {
			var button = $(e.currentTarget);
			var inputName = button.attr('data-bound-file-input');
			var input = this.ui.fileInput.filter('[name=' + inputName + ']');
			input.trigger('click');
		},

		handleFileSelect: function(e) {
			var self          = this;
			var input         = $(e.target);
			var inputName     = input.attr('name');
			var limit         = input.attr(attributes.selectLimit) || 0;
			var previewList   = input.closest(selectors.formGroup).find(selectors.filePreviewList);
			var acceptedType  = input.attr('data-accepted-type');
			var listItemClass = previewList.attr('data-list-item-class');
			var selectedFiles = input[0].files; // FileList object

			if (!inputName) {
				throw new Error('The file input needs a name for the file parser to properly work');
			}

			if (!(inputName in self._files)) {
				self._files[inputName] = [];
			}

			// files is a FileList of File objects
			var output = [];
			for (var i = 0, f; f = selectedFiles[i]; i++) {
				if (!!limit && self._files[inputName].length + 1 > limit) {
					App.execute('notify', {
						title: 'File limit reached',
						text: 'Only <b>' + limit + '</b> file' + (limit > 1 ? 's are' : ' is') + ' allowed in this field',
						type: 'warning'
					});
					break;
				}
				if (!validateFile(acceptedType, f)) {
					App.execute('notify', {
						title: 'Invalid file',
						text: 'File <strong>' + f.name + '</strong> is not of an accepted [' + acceptedType + '] format',
						type: 'error'
					});
					continue;
				}
				var uid = 'file_' + _.uniqueId();
				self._files[inputName].push({
					id: uid,
					file: f
				});
				var fileType =  f.type;
				output.push('<li data-file-id="', uid, '" class="closable ', listItemClass, '">');
				output.push('<strong>', f.name, '</strong>');
				output.push(' - ', parseInt(f.size/1024, 10), ' KB');
				output.push('<span class="closer" aria-hidden="true">&times;</span></li>');
			}
			// append new files to preview list
			previewList.append(output.join(''));
			// handle file deletion
			self._handleFileDeletion(previewList, inputName);
		},

		showExistingFiles: function(attrs, rootUrl) {
			var self = this;
			_.each(attrs, function(value, key, list) {
				var input = self.ui.fileInput.filter('[name="' + key + '"]');
				if (input.length > 0) {
					if (value instanceof Array) {
						for(var i=0, j; j=value[i]; i++) {
							self.addExistingFile(value[i], key, rootUrl);
						}
					} else {
						self.addExistingFile(value, key, rootUrl);
					}
				}
			});
		},

		addExistingFile: function(fileUrl, inputName, rootUrl) {
			if (!fileUrl || !inputName) {
				return;
			}
			var input = this.ui.fileInput.filter('[name="' + inputName + '"]');
			if (input.length === 0) {
				throw new Error('There is no input with name `' + inputName + '` to attach the file');
			}
			if (!(inputName in this._files)) {
				this._files[inputName] = [];
			}
			var limit = input.attr(attributes.selectLimit) || 0;
			if (this._files[inputName].length + 1 > limit) {
				throw new Error('File limit (' + limit + ') reached for input`' + inputName + '`');
			}
			var uid = 'file_' + _.uniqueId();
			this._files[inputName].push({
				id: uid,
				file: null,
				url: fileUrl
			});
			var previewList = input.closest(selectors.formGroup).find(selectors.filePreviewList);
			var listItemClass = previewList.attr('data-list-item-class');

			var output = [];
			output.push('<li data-file-id="', uid, '" class="closable ', listItemClass, '">');
			output.push('<a target="_blank" href="', (rootUrl + '/' + fileUrl), '">');
			output.push('<strong>', fileUrl.split('/').pop(), '</strong>');
			output.push('</a>');
			output.push('<span class="closer" aria-hidden="true">&times;</span></li>');

			// append new files to preview list
			previewList.append(output.join(''));
			// handle file deletion
			this._handleFileDeletion(previewList, inputName);
		},

		_handleFileDeletion: function(previewList, inputName) {
			var self = this;
			// start listening for clicks on `closer`
			previewList.off().on('click', '.closer', function(e) {
				// animate/hide the list item
				var li = $(this).closest('li');
				li.animate({opacity:0}, 200, function() {
					li.remove();
				});
				// delete file from memory
				var fileId = li.attr('data-file-id');
				self._files[inputName] = _.reject(self._files[inputName], function(file) {
					if (file.id === fileId) {
						// trigger event that a controller may be interested in catching
						self.trigger('file:deleted', inputName, file.url);
					}
					return file.id === fileId;
				});

			});
		},

		initDatetimePicker: function() {
			this.ui.datetimeInput.datetimepicker({
				pickTime: false,
				useCurrent: false
			});
		},

		submitOnEnter: function(e) {
			if (e.which === 13) {
				this.submitForm(e);
			}
		}
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27), __webpack_require__(28)))

/***/ },

/***/ 66:
/***/ function(module, exports, __webpack_require__) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<section class="container max-width-xs">\r\n	<div class="page-header">\r\n		<h4>Login</h4>\r\n	</div>\r\n\r\n	<form role="form">\r\n\r\n		<div class="panel panel-danger hidden">\r\n			<div class="panel-heading">\r\n				<h3 class="panel-title"><span class="icomoon icomoon-warning2"></span>Wrong credentials</h3>\r\n			</div>\r\n			<div class="panel-body">\r\n				Please make sure your username and password are correct\r\n			</div>\r\n		</div>\r\n\r\n		<div class="form-group">\r\n			<label for="user[email]">Email</label>\r\n			<div class="input-group">\r\n				<span class="input-group-addon"><span class="icomoon icomoon-at-sign"></span></span>\r\n				<input type="email" class="form-control" name="user[email]" placeholder="example@email.com" value="' +
	((__t = ( email )) == null ? '' : __t) +
	'">\r\n			</div>\r\n			<p class="text-danger validation-error hidden"></p>\r\n		</div>\r\n		<div class="form-group">\r\n			<label for="password">Password</label>\r\n			<div class="input-group">\r\n				<span class="input-group-addon"><span class="icomoon icomoon-key"></span></span>\r\n				<input type="password" class="form-control" name="password" placeholder="Your password">\r\n			</div>\r\n			<p class="text-danger validation-error hidden"></p>\r\n		</div>\r\n		<div class="form-group">\r\n			<button type="button" class="btn btn-success btn-submit">Login</button>\r\n			<button type="button" class="btn btn-success preloader hidden" disabled="disabled">Processing...</button>\r\n			<button type="button" class="btn btn-default btn-cancel">Cancel</button>\r\n		</div>\r\n\r\n	</form>\r\n\r\n	<p class="help-block">\r\n		Forgot your password?\r\n		<a href="' +
	((__t = ( rootUrl )) == null ? '' : __t) +
	'/reset/recover">Recover it</a>\r\n	</p>\r\n\r\n</section>';

	}
	return __p
	}

/***/ },

/***/ 72:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Backbone.Syphon, v0.6.0
	// ----------------------------------
	//
	// Copyright (c) 2015 Derick Bailey, Muted Solutions, LLC.
	// Distributed under MIT license
	//
	// http://github.com/marionettejs/backbone.syphon
	(function(root, factory) {

	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(28), __webpack_require__(45), __webpack_require__(27)], __WEBPACK_AMD_DEFINE_RESULT__ = function(_, Backbone, $) {
	      return factory(_, Backbone, $);
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== 'undefined') {
	    var _ = require('underscore');
	    var Backbone = require('backbone');
	    var $ = require('jquery');
	    module.exports = factory(_, Backbone, $);
	  } else {
	    factory(root._, root.Backbone, root.jQuery);
	  }

	}(this, function(_, Backbone, $) {
	  'use strict';

	  var previousSyphon = Backbone.Syphon;

	  var Syphon = Backbone.Syphon = {};

	  Syphon.VERSION = '0.6.0';

	  Syphon.noConflict = function() {
	    Backbone.Syphon = previousSyphon;
	    return this;
	  };

	  /* jshint maxstatements: 13, maxlen: 102, maxcomplexity: 8, latedef: false */
	  
	  // Ignore Element Types
	  // --------------------
	  
	  // Tell Syphon to ignore all elements of these types. You can
	  // push new types to ignore directly in to this array.
	  Syphon.ignoredTypes = ['button', 'submit', 'reset', 'fieldset'];
	  
	  // Syphon
	  // ------
	  
	  // Get a JSON object that represents
	  // all of the form inputs, in this view.
	  // Alternately, pass a form element directly
	  // in place of the view.
	  Syphon.serialize = function(view, options) {
	    var data = {};
	  
	    // Build the configuration
	    var config = buildConfig(options);
	  
	    // Get all of the elements to process
	    var elements = getInputElements(view, config);
	  
	    // Process all of the elements
	    _.each(elements, function(el) {
	      var $el = $(el);
	      var type = getElementType($el);
	  
	      // Get the key for the input
	      var keyExtractor = config.keyExtractors.get(type);
	      var key = keyExtractor($el);
	  
	      // Get the value for the input
	      var inputReader = config.inputReaders.get(type);
	      var value = inputReader($el);
	  
	      // Get the key assignment validator and make sure
	      // it's valid before assigning the value to the key
	      var validKeyAssignment = config.keyAssignmentValidators.get(type);
	      if (validKeyAssignment($el, key, value)) {
	        var keychain = config.keySplitter(key);
	        data = assignKeyValue(data, keychain, value);
	      }
	    });
	  
	    // Done; send back the results.
	    return data;
	  };
	  
	  // Use the given JSON object to populate
	  // all of the form inputs, in this view.
	  // Alternately, pass a form element directly
	  // in place of the view.
	  Syphon.deserialize = function(view, data, options) {
	    // Build the configuration
	    var config = buildConfig(options);
	  
	    // Get all of the elements to process
	    var elements = getInputElements(view, config);
	  
	    // Flatten the data structure that we are deserializing
	    var flattenedData = flattenData(config, data);
	  
	    // Process all of the elements
	    _.each(elements, function(el) {
	      var $el = $(el);
	      var type = getElementType($el);
	  
	      // Get the key for the input
	      var keyExtractor = config.keyExtractors.get(type);
	      var key = keyExtractor($el);
	  
	      // Get the input writer and the value to write
	      var inputWriter = config.inputWriters.get(type);
	      var value = flattenedData[key];
	  
	      // Write the value to the input
	      inputWriter($el, value);
	    });
	  };
	  
	  // Helpers
	  // -------
	  
	  // Retrieve all of the form inputs
	  // from the form
	  var getInputElements = function(view, config) {
	    var formInputs = getForm(view);
	  
	    formInputs = _.reject(formInputs, function(el) {
	      var reject;
	      var myType = getElementType(el);
	      var extractor = config.keyExtractors.get(myType);
	      var identifier = extractor($(el));
	  
	      var foundInIgnored = _.find(config.ignoredTypes, function(ignoredTypeOrSelector) {
	        return (ignoredTypeOrSelector === myType) || $(el).is(ignoredTypeOrSelector);
	      });
	  
	      var foundInInclude = _.include(config.include, identifier);
	      var foundInExclude = _.include(config.exclude, identifier);
	  
	      if (foundInInclude) {
	        reject = false;
	      } else {
	        if (config.include) {
	          reject = true;
	        } else {
	          reject = (foundInExclude || foundInIgnored);
	        }
	      }
	  
	      return reject;
	    });
	  
	    return formInputs;
	  };
	  
	  // Determine what type of element this is. It
	  // will either return the `type` attribute of
	  // an `<input>` element, or the `tagName` of
	  // the element when the element is not an `<input>`.
	  var getElementType = function(el) {
	    var typeAttr;
	    var $el = $(el);
	    var tagName = $el[0].tagName;
	    var type = tagName;
	  
	    if (tagName.toLowerCase() === 'input') {
	      typeAttr = $el.attr('type');
	      if (typeAttr) {
	        type = typeAttr;
	      } else {
	        type = 'text';
	      }
	    }
	  
	    // Always return the type as lowercase
	    // so it can be matched to lowercase
	    // type registrations.
	    return type.toLowerCase();
	  };
	  
	  // If a dom element is given, just return the form fields.
	  // Otherwise, get the form fields from the view.
	  var getForm = function(viewOrForm) {
	    if (_.isUndefined(viewOrForm.$el)) {
	      return $(viewOrForm).children(':input');
	    } else {
	      return viewOrForm.$(':input');
	    }
	  };
	  
	  // Build a configuration object and initialize
	  // default values.
	  var buildConfig = function(options) {
	    var config = _.clone(options) || {};
	  
	    config.ignoredTypes = _.clone(Syphon.ignoredTypes);
	    config.inputReaders = config.inputReaders || Syphon.InputReaders;
	    config.inputWriters = config.inputWriters || Syphon.InputWriters;
	    config.keyExtractors = config.keyExtractors || Syphon.KeyExtractors;
	    config.keySplitter = config.keySplitter || Syphon.KeySplitter;
	    config.keyJoiner = config.keyJoiner || Syphon.KeyJoiner;
	    config.keyAssignmentValidators = config.keyAssignmentValidators || Syphon.KeyAssignmentValidators;
	  
	    return config;
	  };
	  
	  // Assigns `value` to a parsed JSON key.
	  //
	  // The first parameter is the object which will be
	  // modified to store the key/value pair.
	  //
	  // The second parameter accepts an array of keys as a
	  // string with an option array containing a
	  // single string as the last option.
	  //
	  // The third parameter is the value to be assigned.
	  //
	  // Examples:
	  //
	  // `['foo', 'bar', 'baz'] => {foo: {bar: {baz: 'value'}}}`
	  //
	  // `['foo', 'bar', ['baz']] => {foo: {bar: {baz: ['value']}}}`
	  //
	  // When the final value is an array with a string, the key
	  // becomes an array, and values are pushed in to the array,
	  // allowing multiple fields with the same name to be
	  // assigned to the array.
	  var assignKeyValue = function(obj, keychain, value) {
	    if (!keychain) { return obj; }
	  
	    var key = keychain.shift();
	  
	    // build the current object we need to store data
	    if (!obj[key]) {
	      obj[key] = _.isArray(key) ? [] : {};
	    }
	  
	    // if it's the last key in the chain, assign the value directly
	    if (keychain.length === 0) {
	      if (_.isArray(obj[key])) {
	        obj[key].push(value);
	      } else {
	        obj[key] = value;
	      }
	    }
	  
	    // recursive parsing of the array, depth-first
	    if (keychain.length > 0) {
	      assignKeyValue(obj[key], keychain, value);
	    }
	  
	    return obj;
	  };
	  
	  // Flatten the data structure in to nested strings, using the
	  // provided `KeyJoiner` function.
	  //
	  // Example:
	  //
	  // This input:
	  //
	  // ```js
	  // {
	  //   widget: 'wombat',
	  //   foo: {
	  //     bar: 'baz',
	  //     baz: {
	  //       quux: 'qux'
	  //     },
	  //     quux: ['foo', 'bar']
	  //   }
	  // }
	  // ```
	  //
	  // With a KeyJoiner that uses [ ] square brackets,
	  // should produce this output:
	  //
	  // ```js
	  // {
	  //  'widget': 'wombat',
	  //  'foo[bar]': 'baz',
	  //  'foo[baz][quux]': 'qux',
	  //  'foo[quux]': ['foo', 'bar']
	  // }
	  // ```
	  var flattenData = function(config, data, parentKey) {
	    var flatData = {};
	  
	    _.each(data, function(value, keyName) {
	      var hash = {};
	  
	      // If there is a parent key, join it with
	      // the current, child key.
	      if (parentKey) {
	        keyName = config.keyJoiner(parentKey, keyName);
	      }
	  
	      if (_.isArray(value)) {
	        keyName += '[]';
	        hash[keyName] = value;
	      } else if (_.isObject(value)) {
	        hash = flattenData(config, value, keyName);
	      } else {
	        hash[keyName] = value;
	      }
	  
	      // Store the resulting key/value pairs in the
	      // final flattened data object
	      _.extend(flatData, hash);
	    });
	  
	    return flatData;
	  };
	  
	  // Type Registry
	  // -------------
	  
	  // Type Registries allow you to register something to
	  // an input type, and retrieve either the item registered
	  // for a specific type or the default registration
	  var TypeRegistry = Syphon.TypeRegistry = function() {
	    this.registeredTypes = {};
	  };
	  
	  // Borrow Backbone's `extend` keyword for our TypeRegistry
	  TypeRegistry.extend = Backbone.Model.extend;
	  
	  _.extend(TypeRegistry.prototype, {
	  
	    // Get the registered item by type. If nothing is
	    // found for the specified type, the default is
	    // returned.
	    get: function(type) {
	      if (_.has(this.registeredTypes, type)) {
	        return this.registeredTypes[type];
	      } else {
	        return this.registeredTypes['default'];
	      }
	    },
	  
	    // Register a new item for a specified type
	    register: function(type, item) {
	      this.registeredTypes[type] = item;
	    },
	  
	    // Register a default item to be used when no
	    // item for a specified type is found
	    registerDefault: function(item) {
	      this.registeredTypes['default'] = item;
	    },
	  
	    // Remove an item from a given type registration
	    unregister: function(type) {
	      if (_.has(this.registeredTypes, type)) {
	        delete this.registeredTypes[type];
	      }
	    }
	  });
	  
	  // Key Extractors
	  // --------------
	  
	  // Key extractors produce the "key" in `{key: "value"}`
	  // pairs, when serializing.
	  var KeyExtractorSet = Syphon.KeyExtractorSet = TypeRegistry.extend();
	  
	  // Built-in Key Extractors
	  var KeyExtractors = Syphon.KeyExtractors = new KeyExtractorSet();
	  
	  // The default key extractor, which uses the
	  // input element's "name" attribute
	  KeyExtractors.registerDefault(function($el) {
	    return $el.prop('name') || '';
	  });
	  
	  // Input Readers
	  // -------------
	  
	  // Input Readers are used to extract the value from
	  // an input element, for the serialized object result
	  var InputReaderSet = Syphon.InputReaderSet = TypeRegistry.extend();
	  
	  // Built-in Input Readers
	  var InputReaders = Syphon.InputReaders = new InputReaderSet();
	  
	  // The default input reader, which uses an input
	  // element's "value"
	  InputReaders.registerDefault(function($el) {
	    return $el.val();
	  });
	  
	  // Checkbox reader, returning a boolean value for
	  // whether or not the checkbox is checked.
	  InputReaders.register('checkbox', function($el) {
	    return ($el.prop('indeterminate')) ? null : $el.prop('checked');
	  });
	  
	  // Input Writers
	  // -------------
	  
	  // Input Writers are used to insert a value from an
	  // object into an input element.
	  var InputWriterSet = Syphon.InputWriterSet = TypeRegistry.extend();
	  
	  // Built-in Input Writers
	  var InputWriters = Syphon.InputWriters = new InputWriterSet();
	  
	  // The default input writer, which sets an input
	  // element's "value"
	  InputWriters.registerDefault(function($el, value) {
	    $el.val(value);
	  });
	  
	  // Checkbox writer, set whether or not the checkbox is checked
	  // depending on the boolean value.
	  InputWriters.register('checkbox', function($el, value) {
	    if (value === null) {
	      $el.prop('indeterminate', true);
	    } else {
	      $el.prop('checked', value);
	    }
	  });
	  
	  // Radio button writer, set whether or not the radio button is
	  // checked.  The button should only be checked if it's value
	  // equals the given value.
	  InputWriters.register('radio', function($el, value) {
	    $el.prop('checked', $el.val() === value.toString());
	  });
	  
	  // Key Assignment Validators
	  // -------------------------
	  
	  // Key Assignment Validators are used to determine whether or not a
	  // key should be assigned to a value, after the key and value have been
	  // extracted from the element. This is the last opportunity to prevent
	  // bad data from getting serialized to your object.
	  
	  var KeyAssignmentValidatorSet = Syphon.KeyAssignmentValidatorSet = TypeRegistry.extend();
	  
	  // Build-in Key Assignment Validators
	  var KeyAssignmentValidators = Syphon.KeyAssignmentValidators = new KeyAssignmentValidatorSet();
	  
	  // Everything is valid by default
	  KeyAssignmentValidators.registerDefault(function() {
	    return true;
	  });
	  
	  // But only the "checked" radio button for a given
	  // radio button group is valid
	  KeyAssignmentValidators.register('radio', function($el, key, value) {
	    return $el.prop('checked');
	  });
	  
	  // Backbone.Syphon.KeySplitter
	  // ---------------------------
	  
	  // This function is used to split DOM element keys in to an array
	  // of parts, which are then used to create a nested result structure.
	  // returning `["foo", "bar"]` results in `{foo: { bar: "value" }}`.
	  //
	  // Override this method to use a custom key splitter, such as:
	  // `<input name="foo.bar.baz">`, `return key.split(".")`
	  Syphon.KeySplitter = function(key) {
	    var matches = key.match(/[^\[\]]+/g);
	    var lastKey;
	  
	    if (key.length > 1 && key.indexOf('[]') === key.length - 2) {
	      lastKey = matches.pop();
	      matches.push([lastKey]);
	    }
	  
	    return matches;
	  };
	  
	  // Backbone.Syphon.KeyJoiner
	  // -------------------------
	  
	  // Take two segments of a key and join them together, to create the
	  // de-normalized key name, when deserializing a data structure back
	  // in to a form.
	  //
	  // Example:
	  //
	  // With this data strucutre `{foo: { bar: {baz: "value", quux: "another"} } }`,
	  // the key joiner will be called with these parameters, and assuming the
	  // join happens with "[ ]" square brackets, the specified output:
	  //
	  // `KeyJoiner("foo", "bar")` //=> "foo[bar]"
	  // `KeyJoiner("foo[bar]", "baz")` //=> "foo[bar][baz]"
	  // `KeyJoiner("foo[bar]", "quux")` //=> "foo[bar][quux]"
	  
	  Syphon.KeyJoiner = function(parentKey, childKey) {
	    return parentKey + '[' + childKey + ']';
	  };
	  

	  return Backbone.Syphon;
	}));


/***/ },

/***/ 73:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	//! version : 3.1.3
	=========================================================
	bootstrap-datetimepicker.js
	https://github.com/Eonasdan/bootstrap-datetimepicker
	=========================================================
	The MIT License (MIT)

	Copyright (c) 2014 Jonathan Peterson

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
	*/
	;(function (root, factory) {
	    'use strict';
	    if (true) {
	        // AMD is used - Register as an anonymous module.
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(27), __webpack_require__(7)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports === 'object') {
	        factory(require('jquery'), require('moment'));
	    }
	    else {
	        // Neither AMD or CommonJS used. Use global variables.
	        if (!jQuery) {
	            throw new Error('bootstrap-datetimepicker requires jQuery to be loaded first');
	        }
	        if (!moment) {
	            throw new Error('bootstrap-datetimepicker requires moment.js to be loaded first');
	        }
	        factory(root.jQuery, moment);
	    }
	}(this, function ($, moment) {
	    'use strict';
	    if (typeof moment === 'undefined') {
	        throw new Error('momentjs is required');
	    }

	    var dpgId = 0,

	    DateTimePicker = function (element, options) {
	        var defaults = $.fn.datetimepicker.defaults,

	            icons = {
	                time: 'glyphicon glyphicon-time',
	                date: 'glyphicon glyphicon-calendar',
	                up: 'glyphicon glyphicon-chevron-up',
	                down: 'glyphicon glyphicon-chevron-down'
	            },

	            picker = this,
	            errored = false,
	            dDate,

	        init = function () {
	            var icon = false, localeData, rInterval;
	            picker.options = $.extend({}, defaults, options);
	            picker.options.icons = $.extend({}, icons, picker.options.icons);

	            picker.element = $(element);

	            dataToOptions();

	            if (!(picker.options.pickTime || picker.options.pickDate)) {
	                throw new Error('Must choose at least one picker');
	            }

	            picker.id = dpgId++;
	            moment.locale(picker.options.language);
	            picker.date = moment();
	            picker.unset = false;
	            picker.isInput = picker.element.is('input');
	            picker.component = false;

	            if (picker.element.hasClass('input-group')) {
	                if (picker.element.find('.datepickerbutton').size() === 0) {//in case there is more then one 'input-group-addon' Issue #48
	                    picker.component = picker.element.find('[class^="input-group-"]');
	                }
	                else {
	                    picker.component = picker.element.find('.datepickerbutton');
	                }
	            }
	            picker.format = picker.options.format;

	            localeData = moment().localeData();

	            if (!picker.format) {
	                picker.format = (picker.options.pickDate ? localeData.longDateFormat('L') : '');
	                if (picker.options.pickDate && picker.options.pickTime) {
	                    picker.format += ' ';
	                }
	                picker.format += (picker.options.pickTime ? localeData.longDateFormat('LT') : '');
	                if (picker.options.useSeconds) {
	                    if (localeData.longDateFormat('LT').indexOf(' A') !== -1) {
	                        picker.format = picker.format.split(' A')[0] + ':ss A';
	                    }
	                    else {
	                        picker.format += ':ss';
	                    }
	                }
	            }
	            picker.use24hours = (picker.format.toLowerCase().indexOf('a') < 0 && picker.format.indexOf('h') < 0);

	            if (picker.component) {
	                icon = picker.component.find('span');
	            }

	            if (picker.options.pickTime) {
	                if (icon) {
	                    icon.addClass(picker.options.icons.time);
	                }
	            }
	            if (picker.options.pickDate) {
	                if (icon) {
	                    icon.removeClass(picker.options.icons.time);
	                    icon.addClass(picker.options.icons.date);
	                }
	            }

	            picker.options.widgetParent =
	                typeof picker.options.widgetParent === 'string' && picker.options.widgetParent ||
	                picker.element.parents().filter(function () {
	                    return 'scroll' === $(this).css('overflow-y');
	                }).get(0) ||
	                'body';

	            picker.widget = $(getTemplate()).appendTo(picker.options.widgetParent);

	            picker.minViewMode = picker.options.minViewMode || 0;
	            if (typeof picker.minViewMode === 'string') {
	                switch (picker.minViewMode) {
	                    case 'months':
	                        picker.minViewMode = 1;
	                        break;
	                    case 'years':
	                        picker.minViewMode = 2;
	                        break;
	                    default:
	                        picker.minViewMode = 0;
	                        break;
	                }
	            }
	            picker.viewMode = picker.options.viewMode || 0;
	            if (typeof picker.viewMode === 'string') {
	                switch (picker.viewMode) {
	                    case 'months':
	                        picker.viewMode = 1;
	                        break;
	                    case 'years':
	                        picker.viewMode = 2;
	                        break;
	                    default:
	                        picker.viewMode = 0;
	                        break;
	                }
	            }

	            picker.viewMode = Math.max(picker.viewMode, picker.minViewMode);

	            picker.options.disabledDates = indexGivenDates(picker.options.disabledDates);
	            picker.options.enabledDates = indexGivenDates(picker.options.enabledDates);

	            picker.startViewMode = picker.viewMode;
	            picker.setMinDate(picker.options.minDate);
	            picker.setMaxDate(picker.options.maxDate);
	            fillDow();
	            fillMonths();
	            fillHours();
	            fillMinutes();
	            fillSeconds();
	            update();
	            showMode();
	            if (!getPickerInput().prop('disabled')) {
	                attachDatePickerEvents();
	            }
	            if (picker.options.defaultDate !== '' && getPickerInput().val() === '') {
	                picker.setValue(picker.options.defaultDate);
	            }
	            if (picker.options.minuteStepping !== 1) {
	                rInterval = picker.options.minuteStepping;
	                picker.date.minutes((Math.round(picker.date.minutes() / rInterval) * rInterval) % 60).seconds(0);
	            }
	        },

	        getPickerInput = function () {
	            var input;

	            if (picker.isInput) {
	                return picker.element;
	            }
	            input = picker.element.find('.datepickerinput');
	            if (input.size() === 0) {
	                input = picker.element.find('input');
	            }
	            else if (!input.is('input')) {
	                throw new Error('CSS class "datepickerinput" cannot be applied to non input element');
	            }
	            return input;
	        },

	        dataToOptions = function () {
	            var eData;
	            if (picker.element.is('input')) {
	                eData = picker.element.data();
	            }
	            else {
	                eData = picker.element.find('input').data();
	            }
	            if (eData.dateFormat !== undefined) {
	                picker.options.format = eData.dateFormat;
	            }
	            if (eData.datePickdate !== undefined) {
	                picker.options.pickDate = eData.datePickdate;
	            }
	            if (eData.datePicktime !== undefined) {
	                picker.options.pickTime = eData.datePicktime;
	            }
	            if (eData.dateUseminutes !== undefined) {
	                picker.options.useMinutes = eData.dateUseminutes;
	            }
	            if (eData.dateUseseconds !== undefined) {
	                picker.options.useSeconds = eData.dateUseseconds;
	            }
	            if (eData.dateUsecurrent !== undefined) {
	                picker.options.useCurrent = eData.dateUsecurrent;
	            }
	            if (eData.calendarWeeks !== undefined) {
	                picker.options.calendarWeeks = eData.calendarWeeks;
	            }
	            if (eData.dateMinutestepping !== undefined) {
	                picker.options.minuteStepping = eData.dateMinutestepping;
	            }
	            if (eData.dateMindate !== undefined) {
	                picker.options.minDate = eData.dateMindate;
	            }
	            if (eData.dateMaxdate !== undefined) {
	                picker.options.maxDate = eData.dateMaxdate;
	            }
	            if (eData.dateShowtoday !== undefined) {
	                picker.options.showToday = eData.dateShowtoday;
	            }
	            if (eData.dateCollapse !== undefined) {
	                picker.options.collapse = eData.dateCollapse;
	            }
	            if (eData.dateLanguage !== undefined) {
	                picker.options.language = eData.dateLanguage;
	            }
	            if (eData.dateDefaultdate !== undefined) {
	                picker.options.defaultDate = eData.dateDefaultdate;
	            }
	            if (eData.dateDisableddates !== undefined) {
	                picker.options.disabledDates = eData.dateDisableddates;
	            }
	            if (eData.dateEnableddates !== undefined) {
	                picker.options.enabledDates = eData.dateEnableddates;
	            }
	            if (eData.dateIcons !== undefined) {
	                picker.options.icons = eData.dateIcons;
	            }
	            if (eData.dateUsestrict !== undefined) {
	                picker.options.useStrict = eData.dateUsestrict;
	            }
	            if (eData.dateDirection !== undefined) {
	                picker.options.direction = eData.dateDirection;
	            }
	            if (eData.dateSidebyside !== undefined) {
	                picker.options.sideBySide = eData.dateSidebyside;
	            }
	            if (eData.dateDaysofweekdisabled !== undefined) {
	                picker.options.daysOfWeekDisabled = eData.dateDaysofweekdisabled;
	            }
	        },

	        place = function () {
	            var position = 'absolute',
	                offset = picker.component ? picker.component.offset() : picker.element.offset(),
	                $window = $(window),
	                placePosition;

	            picker.width = picker.component ? picker.component.outerWidth() : picker.element.outerWidth();
	            offset.top = offset.top + picker.element.outerHeight();

	            if (picker.options.direction === 'up') {
	                placePosition = 'top';
	            } else if (picker.options.direction === 'bottom') {
	                placePosition = 'bottom';
	            } else if (picker.options.direction === 'auto') {
	                if (offset.top + picker.widget.height() > $window.height() + $window.scrollTop() && picker.widget.height() + picker.element.outerHeight() < offset.top) {
	                    placePosition = 'top';
	                } else {
	                    placePosition = 'bottom';
	                }
	            }
	            if (placePosition === 'top') {
	                offset.bottom = $window.height() - offset.top + picker.element.outerHeight() + 3;
	                picker.widget.addClass('top').removeClass('bottom');
	            } else {
	                offset.top += 1;
	                picker.widget.addClass('bottom').removeClass('top');
	            }

	            if (picker.options.width !== undefined) {
	                picker.widget.width(picker.options.width);
	            }

	            if (picker.options.orientation === 'left') {
	                picker.widget.addClass('left-oriented');
	                offset.left = offset.left - picker.widget.width() + 20;
	            }

	            if (isInFixed()) {
	                position = 'fixed';
	                offset.top -= $window.scrollTop();
	                offset.left -= $window.scrollLeft();
	            }

	            if ($window.width() < offset.left + picker.widget.outerWidth()) {
	                offset.right = $window.width() - offset.left - picker.width;
	                offset.left = 'auto';
	                picker.widget.addClass('pull-right');
	            } else {
	                offset.right = 'auto';
	                picker.widget.removeClass('pull-right');
	            }

	            if (placePosition === 'top') {
	                picker.widget.css({
	                    position: position,
	                    bottom: offset.bottom,
	                    top: 'auto',
	                    left: offset.left,
	                    right: offset.right
	                });
	            } else {
	                picker.widget.css({
	                    position: position,
	                    top: offset.top,
	                    bottom: 'auto',
	                    left: offset.left,
	                    right: offset.right
	                });
	            }
	        },

	        notifyChange = function (oldDate, eventType) {
	            if (moment(picker.date).isSame(moment(oldDate)) && !errored) {
	                return;
	            }
	            errored = false;
	            picker.element.trigger({
	                type: 'dp.change',
	                date: moment(picker.date),
	                oldDate: moment(oldDate)
	            });

	            if (eventType !== 'change') {
	                picker.element.change();
	            }
	        },

	        notifyError = function (date) {
	            errored = true;
	            picker.element.trigger({
	                type: 'dp.error',
	                date: moment(date, picker.format, picker.options.useStrict)
	            });
	        },

	        update = function (newDate) {
	            moment.locale(picker.options.language);
	            var dateStr = newDate;
	            if (!dateStr) {
	                dateStr = getPickerInput().val();
	                if (dateStr) {
	                    picker.date = moment(dateStr, picker.format, picker.options.useStrict);
	                }
	                if (!picker.date) {
	                    picker.date = moment();
	                }
	            }
	            picker.viewDate = moment(picker.date).startOf('month');
	            fillDate();
	            fillTime();
	        },

	        fillDow = function () {
	            moment.locale(picker.options.language);
	            var html = $('<tr>'), weekdaysMin = moment.weekdaysMin(), i;
	            if (picker.options.calendarWeeks === true) {
	                html.append('<th class="cw">#</th>');
	            }
	            if (moment().localeData()._week.dow === 0) { // starts on Sunday
	                for (i = 0; i < 7; i++) {
	                    html.append('<th class="dow">' + weekdaysMin[i] + '</th>');
	                }
	            } else {
	                for (i = 1; i < 8; i++) {
	                    if (i === 7) {
	                        html.append('<th class="dow">' + weekdaysMin[0] + '</th>');
	                    } else {
	                        html.append('<th class="dow">' + weekdaysMin[i] + '</th>');
	                    }
	                }
	            }
	            picker.widget.find('.datepicker-days thead').append(html);
	        },

	        fillMonths = function () {
	            moment.locale(picker.options.language);
	            var html = '', i, monthsShort = moment.monthsShort();
	            for (i = 0; i < 12; i++) {
	                html += '<span class="month">' + monthsShort[i] + '</span>';
	            }
	            picker.widget.find('.datepicker-months td').append(html);
	        },

	        fillDate = function () {
	            if (!picker.options.pickDate) {
	                return;
	            }
	            moment.locale(picker.options.language);
	            var year = picker.viewDate.year(),
	                month = picker.viewDate.month(),
	                startYear = picker.options.minDate.year(),
	                startMonth = picker.options.minDate.month(),
	                endYear = picker.options.maxDate.year(),
	                endMonth = picker.options.maxDate.month(),
	                currentDate,
	                prevMonth, nextMonth, html = [], row, clsName, i, days, yearCont, currentYear, months = moment.months();

	            picker.widget.find('.datepicker-days').find('.disabled').removeClass('disabled');
	            picker.widget.find('.datepicker-months').find('.disabled').removeClass('disabled');
	            picker.widget.find('.datepicker-years').find('.disabled').removeClass('disabled');

	            picker.widget.find('.datepicker-days th:eq(1)').text(
	                months[month] + ' ' + year);

	            prevMonth = moment(picker.viewDate, picker.format, picker.options.useStrict).subtract(1, 'months');
	            days = prevMonth.daysInMonth();
	            prevMonth.date(days).startOf('week');
	            if ((year === startYear && month <= startMonth) || year < startYear) {
	                picker.widget.find('.datepicker-days th:eq(0)').addClass('disabled');
	            }
	            if ((year === endYear && month >= endMonth) || year > endYear) {
	                picker.widget.find('.datepicker-days th:eq(2)').addClass('disabled');
	            }

	            nextMonth = moment(prevMonth).add(42, 'd');
	            while (prevMonth.isBefore(nextMonth)) {
	                if (prevMonth.weekday() === moment().startOf('week').weekday()) {
	                    row = $('<tr>');
	                    html.push(row);
	                    if (picker.options.calendarWeeks === true) {
	                        row.append('<td class="cw">' + prevMonth.week() + '</td>');
	                    }
	                }
	                clsName = '';
	                if (prevMonth.year() < year || (prevMonth.year() === year && prevMonth.month() < month)) {
	                    clsName += ' old';
	                } else if (prevMonth.year() > year || (prevMonth.year() === year && prevMonth.month() > month)) {
	                    clsName += ' new';
	                }
	                if (prevMonth.isSame(moment({y: picker.date.year(), M: picker.date.month(), d: picker.date.date()}))) {
	                    clsName += ' active';
	                }
	                if (isInDisableDates(prevMonth, 'day') || !isInEnableDates(prevMonth)) {
	                    clsName += ' disabled';
	                }
	                if (picker.options.showToday === true) {
	                    if (prevMonth.isSame(moment(), 'day')) {
	                        clsName += ' today';
	                    }
	                }
	                if (picker.options.daysOfWeekDisabled) {
	                    for (i = 0; i < picker.options.daysOfWeekDisabled.length; i++) {
	                        if (prevMonth.day() === picker.options.daysOfWeekDisabled[i]) {
	                            clsName += ' disabled';
	                            break;
	                        }
	                    }
	                }
	                row.append('<td class="day' + clsName + '">' + prevMonth.date() + '</td>');

	                currentDate = prevMonth.date();
	                prevMonth.add(1, 'd');

	                if (currentDate === prevMonth.date()) {
	                    prevMonth.add(1, 'd');
	                }
	            }
	            picker.widget.find('.datepicker-days tbody').empty().append(html);
	            currentYear = picker.date.year();
	            months = picker.widget.find('.datepicker-months').find('th:eq(1)').text(year).end().find('span').removeClass('active');
	            if (currentYear === year) {
	                months.eq(picker.date.month()).addClass('active');
	            }
	            if (year - 1 < startYear) {
	                picker.widget.find('.datepicker-months th:eq(0)').addClass('disabled');
	            }
	            if (year + 1 > endYear) {
	                picker.widget.find('.datepicker-months th:eq(2)').addClass('disabled');
	            }
	            for (i = 0; i < 12; i++) {
	                if ((year === startYear && startMonth > i) || (year < startYear)) {
	                    $(months[i]).addClass('disabled');
	                } else if ((year === endYear && endMonth < i) || (year > endYear)) {
	                    $(months[i]).addClass('disabled');
	                }
	            }

	            html = '';
	            year = parseInt(year / 10, 10) * 10;
	            yearCont = picker.widget.find('.datepicker-years').find(
	                'th:eq(1)').text(year + '-' + (year + 9)).parents('table').find('td');
	            picker.widget.find('.datepicker-years').find('th').removeClass('disabled');
	            if (startYear > year) {
	                picker.widget.find('.datepicker-years').find('th:eq(0)').addClass('disabled');
	            }
	            if (endYear < year + 9) {
	                picker.widget.find('.datepicker-years').find('th:eq(2)').addClass('disabled');
	            }
	            year -= 1;
	            for (i = -1; i < 11; i++) {
	                html += '<span class="year' + (i === -1 || i === 10 ? ' old' : '') + (currentYear === year ? ' active' : '') + ((year < startYear || year > endYear) ? ' disabled' : '') + '">' + year + '</span>';
	                year += 1;
	            }
	            yearCont.html(html);
	        },

	        fillHours = function () {
	            moment.locale(picker.options.language);
	            var table = picker.widget.find('.timepicker .timepicker-hours table'), html = '', current, i, j;
	            table.parent().hide();
	            if (picker.use24hours) {
	                current = 0;
	                for (i = 0; i < 6; i += 1) {
	                    html += '<tr>';
	                    for (j = 0; j < 4; j += 1) {
	                        html += '<td class="hour">' + padLeft(current.toString()) + '</td>';
	                        current++;
	                    }
	                    html += '</tr>';
	                }
	            }
	            else {
	                current = 1;
	                for (i = 0; i < 3; i += 1) {
	                    html += '<tr>';
	                    for (j = 0; j < 4; j += 1) {
	                        html += '<td class="hour">' + padLeft(current.toString()) + '</td>';
	                        current++;
	                    }
	                    html += '</tr>';
	                }
	            }
	            table.html(html);
	        },

	        fillMinutes = function () {
	            var table = picker.widget.find('.timepicker .timepicker-minutes table'), html = '', current = 0, i, j, step = picker.options.minuteStepping;
	            table.parent().hide();
	            if (step === 1)  {
	                step = 5;
	            }
	            for (i = 0; i < Math.ceil(60 / step / 4) ; i++) {
	                html += '<tr>';
	                for (j = 0; j < 4; j += 1) {
	                    if (current < 60) {
	                        html += '<td class="minute">' + padLeft(current.toString()) + '</td>';
	                        current += step;
	                    } else {
	                        html += '<td></td>';
	                    }
	                }
	                html += '</tr>';
	            }
	            table.html(html);
	        },

	        fillSeconds = function () {
	            var table = picker.widget.find('.timepicker .timepicker-seconds table'), html = '', current = 0, i, j;
	            table.parent().hide();
	            for (i = 0; i < 3; i++) {
	                html += '<tr>';
	                for (j = 0; j < 4; j += 1) {
	                    html += '<td class="second">' + padLeft(current.toString()) + '</td>';
	                    current += 5;
	                }
	                html += '</tr>';
	            }
	            table.html(html);
	        },

	        fillTime = function () {
	            if (!picker.date) {
	                return;
	            }
	            var timeComponents = picker.widget.find('.timepicker span[data-time-component]'),
	                hour = picker.date.hours(),
	                period = picker.date.format('A');
	            if (!picker.use24hours) {
	                if (hour === 0) {
	                    hour = 12;
	                } else if (hour !== 12) {
	                    hour = hour % 12;
	                }
	                picker.widget.find('.timepicker [data-action=togglePeriod]').text(period);
	            }
	            timeComponents.filter('[data-time-component=hours]').text(padLeft(hour));
	            timeComponents.filter('[data-time-component=minutes]').text(padLeft(picker.date.minutes()));
	            timeComponents.filter('[data-time-component=seconds]').text(padLeft(picker.date.second()));
	        },

	        click = function (e) {
	            e.stopPropagation();
	            e.preventDefault();
	            picker.unset = false;
	            var target = $(e.target).closest('span, td, th'), month, year, step, day, oldDate = moment(picker.date);
	            if (target.length === 1) {
	                if (!target.is('.disabled')) {
	                    switch (target[0].nodeName.toLowerCase()) {
	                        case 'th':
	                            switch (target[0].className) {
	                                case 'picker-switch':
	                                    showMode(1);
	                                    break;
	                                case 'prev':
	                                case 'next':
	                                    step = dpGlobal.modes[picker.viewMode].navStep;
	                                    if (target[0].className === 'prev') {
	                                        step = step * -1;
	                                    }
	                                    picker.viewDate.add(step, dpGlobal.modes[picker.viewMode].navFnc);
	                                    fillDate();
	                                    break;
	                            }
	                            break;
	                        case 'span':
	                            if (target.is('.month')) {
	                                month = target.parent().find('span').index(target);
	                                picker.viewDate.month(month);
	                            } else {
	                                year = parseInt(target.text(), 10) || 0;
	                                picker.viewDate.year(year);
	                            }
	                            if (picker.viewMode === picker.minViewMode) {
	                                picker.date = moment({
	                                    y: picker.viewDate.year(),
	                                    M: picker.viewDate.month(),
	                                    d: picker.viewDate.date(),
	                                    h: picker.date.hours(),
	                                    m: picker.date.minutes(),
	                                    s: picker.date.seconds()
	                                });
	                                set();
	                                notifyChange(oldDate, e.type);
	                            }
	                            showMode(-1);
	                            fillDate();
	                            break;
	                        case 'td':
	                            if (target.is('.day')) {
	                                day = parseInt(target.text(), 10) || 1;
	                                month = picker.viewDate.month();
	                                year = picker.viewDate.year();
	                                if (target.is('.old')) {
	                                    if (month === 0) {
	                                        month = 11;
	                                        year -= 1;
	                                    } else {
	                                        month -= 1;
	                                    }
	                                } else if (target.is('.new')) {
	                                    if (month === 11) {
	                                        month = 0;
	                                        year += 1;
	                                    } else {
	                                        month += 1;
	                                    }
	                                }
	                                picker.date = moment({
	                                    y: year,
	                                    M: month,
	                                    d: day,
	                                    h: picker.date.hours(),
	                                    m: picker.date.minutes(),
	                                    s: picker.date.seconds()
	                                }
	                                );
	                                picker.viewDate = moment({
	                                    y: year, M: month, d: Math.min(28, day)
	                                });
	                                fillDate();
	                                set();
	                                notifyChange(oldDate, e.type);
	                            }
	                            break;
	                    }
	                }
	            }
	        },

	        actions = {
	            incrementHours: function () {
	                checkDate('add', 'hours', 1);
	            },

	            incrementMinutes: function () {
	                checkDate('add', 'minutes', picker.options.minuteStepping);
	            },

	            incrementSeconds: function () {
	                checkDate('add', 'seconds', 1);
	            },

	            decrementHours: function () {
	                checkDate('subtract', 'hours', 1);
	            },

	            decrementMinutes: function () {
	                checkDate('subtract', 'minutes', picker.options.minuteStepping);
	            },

	            decrementSeconds: function () {
	                checkDate('subtract', 'seconds', 1);
	            },

	            togglePeriod: function () {
	                var hour = picker.date.hours();
	                if (hour >= 12) {
	                    hour -= 12;
	                } else {
	                    hour += 12;
	                }
	                picker.date.hours(hour);
	            },

	            showPicker: function () {
	                picker.widget.find('.timepicker > div:not(.timepicker-picker)').hide();
	                picker.widget.find('.timepicker .timepicker-picker').show();
	            },

	            showHours: function () {
	                picker.widget.find('.timepicker .timepicker-picker').hide();
	                picker.widget.find('.timepicker .timepicker-hours').show();
	            },

	            showMinutes: function () {
	                picker.widget.find('.timepicker .timepicker-picker').hide();
	                picker.widget.find('.timepicker .timepicker-minutes').show();
	            },

	            showSeconds: function () {
	                picker.widget.find('.timepicker .timepicker-picker').hide();
	                picker.widget.find('.timepicker .timepicker-seconds').show();
	            },

	            selectHour: function (e) {
	                var hour = parseInt($(e.target).text(), 10);
	                if (!picker.use24hours) {
	                    if (picker.date.hours() >= 12) {
	                        if (hour !== 12) {
	                            hour += 12;
	                        }
	                    } else {
	                        if (hour === 12) {
	                            hour = 0;
	                        }
	                    }
	                }
	                picker.date.hours(hour);
	                actions.showPicker.call(picker);
	            },

	            selectMinute: function (e) {
	                picker.date.minutes(parseInt($(e.target).text(), 10));
	                actions.showPicker.call(picker);
	            },

	            selectSecond: function (e) {
	                picker.date.seconds(parseInt($(e.target).text(), 10));
	                actions.showPicker.call(picker);
	            }
	        },

	        doAction = function (e) {
	            var oldDate = moment(picker.date),
	                action = $(e.currentTarget).data('action'),
	                rv = actions[action].apply(picker, arguments);
	            stopEvent(e);
	            if (!picker.date) {
	                picker.date = moment({y: 1970});
	            }
	            set();
	            fillTime();
	            notifyChange(oldDate, e.type);
	            return rv;
	        },

	        stopEvent = function (e) {
	            e.stopPropagation();
	            e.preventDefault();
	        },

	        keydown = function (e) {
	            if (e.keyCode === 27) { // allow escape to hide picker
	                picker.hide();
	            }
	        },

	        change = function (e) {
	            moment.locale(picker.options.language);
	            var input = $(e.target), oldDate = moment(picker.date), newDate = moment(input.val(), picker.format, picker.options.useStrict);
	            if (newDate.isValid() && !isInDisableDates(newDate) && isInEnableDates(newDate)) {
	                update();
	                picker.setValue(newDate);
	                notifyChange(oldDate, e.type);
	                set();
	            }
	            else {
	                picker.viewDate = oldDate;
	                picker.unset = true;
	                notifyChange(oldDate, e.type);
	                notifyError(newDate);
	            }
	        },

	        showMode = function (dir) {
	            if (dir) {
	                picker.viewMode = Math.max(picker.minViewMode, Math.min(2, picker.viewMode + dir));
	            }
	            picker.widget.find('.datepicker > div').hide().filter('.datepicker-' + dpGlobal.modes[picker.viewMode].clsName).show();
	        },

	        attachDatePickerEvents = function () {
	            var $this, $parent, expanded, closed, collapseData;
	            picker.widget.on('click', '.datepicker *', $.proxy(click, this)); // this handles date picker clicks
	            picker.widget.on('click', '[data-action]', $.proxy(doAction, this)); // this handles time picker clicks
	            picker.widget.on('mousedown', $.proxy(stopEvent, this));
	            picker.element.on('keydown', $.proxy(keydown, this));
	            if (picker.options.pickDate && picker.options.pickTime) {
	                picker.widget.on('click.togglePicker', '.accordion-toggle', function (e) {
	                    e.stopPropagation();
	                    $this = $(this);
	                    $parent = $this.closest('ul');
	                    expanded = $parent.find('.in');
	                    closed = $parent.find('.collapse:not(.in)');

	                    if (expanded && expanded.length) {
	                        collapseData = expanded.data('collapse');
	                        if (collapseData && collapseData.transitioning) {
	                            return;
	                        }
	                        expanded.collapse('hide');
	                        closed.collapse('show');
	                        $this.find('span').toggleClass(picker.options.icons.time + ' ' + picker.options.icons.date);
	                        if (picker.component) {
	                            picker.component.find('span').toggleClass(picker.options.icons.time + ' ' + picker.options.icons.date);
	                        }
	                    }
	                });
	            }
	            if (picker.isInput) {
	                picker.element.on({
	                    'click': $.proxy(picker.show, this),
	                    'focus': $.proxy(picker.show, this),
	                    'change': $.proxy(change, this),
	                    'blur': $.proxy(picker.hide, this)
	                });
	            } else {
	                picker.element.on({
	                    'change': $.proxy(change, this)
	                }, 'input');
	                if (picker.component) {
	                    picker.component.on('click', $.proxy(picker.show, this));
	                    picker.component.on('mousedown', $.proxy(stopEvent, this));
	                } else {
	                    picker.element.on('click', $.proxy(picker.show, this));
	                }
	            }
	        },

	        attachDatePickerGlobalEvents = function () {
	            $(window).on(
	                'resize.datetimepicker' + picker.id, $.proxy(place, this));
	            if (!picker.isInput) {
	                $(document).on(
	                    'mousedown.datetimepicker' + picker.id, $.proxy(picker.hide, this));
	            }
	        },

	        detachDatePickerEvents = function () {
	            picker.widget.off('click', '.datepicker *', picker.click);
	            picker.widget.off('click', '[data-action]');
	            picker.widget.off('mousedown', picker.stopEvent);
	            if (picker.options.pickDate && picker.options.pickTime) {
	                picker.widget.off('click.togglePicker');
	            }
	            if (picker.isInput) {
	                picker.element.off({
	                    'focus': picker.show,
	                    'change': change,
	                    'click': picker.show,
	                    'blur' : picker.hide
	                });
	            } else {
	                picker.element.off({
	                    'change': change
	                }, 'input');
	                if (picker.component) {
	                    picker.component.off('click', picker.show);
	                    picker.component.off('mousedown', picker.stopEvent);
	                } else {
	                    picker.element.off('click', picker.show);
	                }
	            }
	        },

	        detachDatePickerGlobalEvents = function () {
	            $(window).off('resize.datetimepicker' + picker.id);
	            if (!picker.isInput) {
	                $(document).off('mousedown.datetimepicker' + picker.id);
	            }
	        },

	        isInFixed = function () {
	            if (picker.element) {
	                var parents = picker.element.parents(), inFixed = false, i;
	                for (i = 0; i < parents.length; i++) {
	                    if ($(parents[i]).css('position') === 'fixed') {
	                        inFixed = true;
	                        break;
	                    }
	                }
	                return inFixed;
	            } else {
	                return false;
	            }
	        },

	        set = function () {
	            moment.locale(picker.options.language);
	            var formatted = '';
	            if (!picker.unset) {
	                formatted = moment(picker.date).format(picker.format);
	            }
	            getPickerInput().val(formatted);
	            picker.element.data('date', formatted);
	            if (!picker.options.pickTime) {
	                picker.hide();
	            }
	        },

	        checkDate = function (direction, unit, amount) {
	            moment.locale(picker.options.language);
	            var newDate;
	            if (direction === 'add') {
	                newDate = moment(picker.date);
	                if (newDate.hours() === 23) {
	                    newDate.add(amount, unit);
	                }
	                newDate.add(amount, unit);
	            }
	            else {
	                newDate = moment(picker.date).subtract(amount, unit);
	            }
	            if (isInDisableDates(moment(newDate.subtract(amount, unit))) || isInDisableDates(newDate)) {
	                notifyError(newDate.format(picker.format));
	                return;
	            }

	            if (direction === 'add') {
	                picker.date.add(amount, unit);
	            }
	            else {
	                picker.date.subtract(amount, unit);
	            }
	            picker.unset = false;
	        },

	        isInDisableDates = function (date, timeUnit) {
	            moment.locale(picker.options.language);
	            var maxDate = moment(picker.options.maxDate, picker.format, picker.options.useStrict),
	                minDate = moment(picker.options.minDate, picker.format, picker.options.useStrict);

	            if (timeUnit) {
	                maxDate = maxDate.endOf(timeUnit);
	                minDate = minDate.startOf(timeUnit);
	            }

	            if (date.isAfter(maxDate) || date.isBefore(minDate)) {
	                return true;
	            }
	            if (picker.options.disabledDates === false) {
	                return false;
	            }
	            return picker.options.disabledDates[date.format('YYYY-MM-DD')] === true;
	        },
	        isInEnableDates = function (date) {
	            moment.locale(picker.options.language);
	            if (picker.options.enabledDates === false) {
	                return true;
	            }
	            return picker.options.enabledDates[date.format('YYYY-MM-DD')] === true;
	        },

	        indexGivenDates = function (givenDatesArray) {
	            // Store given enabledDates and disabledDates as keys.
	            // This way we can check their existence in O(1) time instead of looping through whole array.
	            // (for example: picker.options.enabledDates['2014-02-27'] === true)
	            var givenDatesIndexed = {}, givenDatesCount = 0, i;
	            for (i = 0; i < givenDatesArray.length; i++) {
	                if (moment.isMoment(givenDatesArray[i]) || givenDatesArray[i] instanceof Date) {
	                    dDate = moment(givenDatesArray[i]);
	                } else {
	                    dDate = moment(givenDatesArray[i], picker.format, picker.options.useStrict);
	                }
	                if (dDate.isValid()) {
	                    givenDatesIndexed[dDate.format('YYYY-MM-DD')] = true;
	                    givenDatesCount++;
	                }
	            }
	            if (givenDatesCount > 0) {
	                return givenDatesIndexed;
	            }
	            return false;
	        },

	        padLeft = function (string) {
	            string = string.toString();
	            if (string.length >= 2) {
	                return string;
	            }
	            return '0' + string;
	        },

	        getTemplate = function () {
	            var
	                headTemplate =
	                        '<thead>' +
	                            '<tr>' +
	                                '<th class="prev">&lsaquo;</th><th colspan="' + (picker.options.calendarWeeks ? '6' : '5') + '" class="picker-switch"></th><th class="next">&rsaquo;</th>' +
	                            '</tr>' +
	                        '</thead>',
	                contTemplate =
	                        '<tbody><tr><td colspan="' + (picker.options.calendarWeeks ? '8' : '7') + '"></td></tr></tbody>',
	                template = '<div class="datepicker-days">' +
	                    '<table class="table-condensed">' + headTemplate + '<tbody></tbody></table>' +
	                '</div>' +
	                '<div class="datepicker-months">' +
	                    '<table class="table-condensed">' + headTemplate + contTemplate + '</table>' +
	                '</div>' +
	                '<div class="datepicker-years">' +
	                    '<table class="table-condensed">' + headTemplate + contTemplate + '</table>' +
	                '</div>',
	                ret = '';
	            if (picker.options.pickDate && picker.options.pickTime) {
	                ret = '<div class="bootstrap-datetimepicker-widget' + (picker.options.sideBySide ? ' timepicker-sbs' : '') + (picker.use24hours ? ' usetwentyfour' : '') + ' dropdown-menu" style="z-index:9999 !important;">';
	                if (picker.options.sideBySide) {
	                    ret += '<div class="row">' +
	                       '<div class="col-sm-6 datepicker">' + template + '</div>' +
	                       '<div class="col-sm-6 timepicker">' + tpGlobal.getTemplate() + '</div>' +
	                     '</div>';
	                } else {
	                    ret += '<ul class="list-unstyled">' +
	                        '<li' + (picker.options.collapse ? ' class="collapse in"' : '') + '>' +
	                            '<div class="datepicker">' + template + '</div>' +
	                        '</li>' +
	                        '<li class="picker-switch accordion-toggle"><a class="btn" style="width:100%"><span class="' + picker.options.icons.time + '"></span></a></li>' +
	                        '<li' + (picker.options.collapse ? ' class="collapse"' : '') + '>' +
	                            '<div class="timepicker">' + tpGlobal.getTemplate() + '</div>' +
	                        '</li>' +
	                   '</ul>';
	                }
	                ret += '</div>';
	                return ret;
	            }
	            if (picker.options.pickTime) {
	                return (
	                    '<div class="bootstrap-datetimepicker-widget dropdown-menu">' +
	                        '<div class="timepicker">' + tpGlobal.getTemplate() + '</div>' +
	                    '</div>'
	                );
	            }
	            return (
	                '<div class="bootstrap-datetimepicker-widget dropdown-menu">' +
	                    '<div class="datepicker">' + template + '</div>' +
	                '</div>'
	            );
	        },

	        dpGlobal = {
	            modes: [
	                {
	                    clsName: 'days',
	                    navFnc: 'month',
	                    navStep: 1
	                },
	                {
	                    clsName: 'months',
	                    navFnc: 'year',
	                    navStep: 1
	                },
	                {
	                    clsName: 'years',
	                    navFnc: 'year',
	                    navStep: 10
	                }
	            ]
	        },

	        tpGlobal = {
	            hourTemplate: '<span data-action="showHours"   data-time-component="hours"   class="timepicker-hour"></span>',
	            minuteTemplate: '<span data-action="showMinutes" data-time-component="minutes" class="timepicker-minute"></span>',
	            secondTemplate: '<span data-action="showSeconds"  data-time-component="seconds" class="timepicker-second"></span>'
	        };

	        tpGlobal.getTemplate = function () {
	            return (
	                '<div class="timepicker-picker">' +
	                    '<table class="table-condensed">' +
	                        '<tr>' +
	                            '<td><a href="#" class="btn" data-action="incrementHours"><span class="' + picker.options.icons.up + '"></span></a></td>' +
	                            '<td class="separator"></td>' +
	                            '<td>' + (picker.options.useMinutes ? '<a href="#" class="btn" data-action="incrementMinutes"><span class="' + picker.options.icons.up + '"></span></a>' : '') + '</td>' +
	                            (picker.options.useSeconds ?
	                                '<td class="separator"></td><td><a href="#" class="btn" data-action="incrementSeconds"><span class="' + picker.options.icons.up + '"></span></a></td>' : '') +
	                            (picker.use24hours ? '' : '<td class="separator"></td>') +
	                        '</tr>' +
	                        '<tr>' +
	                            '<td>' + tpGlobal.hourTemplate + '</td> ' +
	                            '<td class="separator">:</td>' +
	                            '<td>' + (picker.options.useMinutes ? tpGlobal.minuteTemplate : '<span class="timepicker-minute">00</span>') + '</td> ' +
	                            (picker.options.useSeconds ?
	                                '<td class="separator">:</td><td>' + tpGlobal.secondTemplate + '</td>' : '') +
	                            (picker.use24hours ? '' : '<td class="separator"></td>' +
	                            '<td><button type="button" class="btn btn-primary" data-action="togglePeriod"></button></td>') +
	                        '</tr>' +
	                        '<tr>' +
	                            '<td><a href="#" class="btn" data-action="decrementHours"><span class="' + picker.options.icons.down + '"></span></a></td>' +
	                            '<td class="separator"></td>' +
	                            '<td>' + (picker.options.useMinutes ? '<a href="#" class="btn" data-action="decrementMinutes"><span class="' + picker.options.icons.down + '"></span></a>' : '') + '</td>' +
	                            (picker.options.useSeconds ?
	                                '<td class="separator"></td><td><a href="#" class="btn" data-action="decrementSeconds"><span class="' + picker.options.icons.down + '"></span></a></td>' : '') +
	                            (picker.use24hours ? '' : '<td class="separator"></td>') +
	                        '</tr>' +
	                    '</table>' +
	                '</div>' +
	                '<div class="timepicker-hours" data-action="selectHour">' +
	                    '<table class="table-condensed"></table>' +
	                '</div>' +
	                '<div class="timepicker-minutes" data-action="selectMinute">' +
	                    '<table class="table-condensed"></table>' +
	                '</div>' +
	                (picker.options.useSeconds ?
	                    '<div class="timepicker-seconds" data-action="selectSecond"><table class="table-condensed"></table></div>' : '')
	            );
	        };

	        picker.destroy = function () {
	            detachDatePickerEvents();
	            detachDatePickerGlobalEvents();
	            picker.widget.remove();
	            picker.element.removeData('DateTimePicker');
	            if (picker.component) {
	                picker.component.removeData('DateTimePicker');
	            }
	        };

	        picker.show = function (e) {
	            if (getPickerInput().prop('disabled')) {
	                return;
	            }
	            if (picker.options.useCurrent) {
	                if (getPickerInput().val() === '') {
	                    if (picker.options.minuteStepping !== 1) {
	                        var mDate = moment(),
	                        rInterval = picker.options.minuteStepping;
	                        mDate.minutes((Math.round(mDate.minutes() / rInterval) * rInterval) % 60).seconds(0);
	                        picker.setValue(mDate.format(picker.format));
	                    } else {
	                        picker.setValue(moment().format(picker.format));
	                    }
	                    notifyChange('', e.type);
	                }
	            }
	            // if this is a click event on the input field and picker is already open don't hide it
	            if (e && e.type === 'click' && picker.isInput && picker.widget.hasClass('picker-open')) {
	                return;
	            }
	            if (picker.widget.hasClass('picker-open')) {
	                picker.widget.hide();
	                picker.widget.removeClass('picker-open');
	            }
	            else {
	                picker.widget.show();
	                picker.widget.addClass('picker-open');
	            }
	            picker.height = picker.component ? picker.component.outerHeight() : picker.element.outerHeight();
	            place();
	            picker.element.trigger({
	                type: 'dp.show',
	                date: moment(picker.date)
	            });
	            attachDatePickerGlobalEvents();
	            if (e) {
	                stopEvent(e);
	            }
	        };

	        picker.disable = function () {
	            var input = getPickerInput();
	            if (input.prop('disabled')) {
	                return;
	            }
	            input.prop('disabled', true);
	            detachDatePickerEvents();
	        };

	        picker.enable = function () {
	            var input = getPickerInput();
	            if (!input.prop('disabled')) {
	                return;
	            }
	            input.prop('disabled', false);
	            attachDatePickerEvents();
	        };

	        picker.hide = function () {
	            // Ignore event if in the middle of a picker transition
	            var collapse = picker.widget.find('.collapse'), i, collapseData;
	            for (i = 0; i < collapse.length; i++) {
	                collapseData = collapse.eq(i).data('collapse');
	                if (collapseData && collapseData.transitioning) {
	                    return;
	                }
	            }
	            picker.widget.hide();
	            picker.widget.removeClass('picker-open');
	            picker.viewMode = picker.startViewMode;
	            showMode();
	            picker.element.trigger({
	                type: 'dp.hide',
	                date: moment(picker.date)
	            });
	            detachDatePickerGlobalEvents();
	        };

	        picker.setValue = function (newDate) {
	            moment.locale(picker.options.language);
	            if (!newDate) {
	                picker.unset = true;
	                set();
	            } else {
	                picker.unset = false;
	            }
	            if (!moment.isMoment(newDate)) {
	                newDate = (newDate instanceof Date) ? moment(newDate) : moment(newDate, picker.format, picker.options.useStrict);
	            } else {
	                newDate = newDate.locale(picker.options.language);
	            }
	            if (newDate.isValid()) {
	                picker.date = newDate;
	                set();
	                picker.viewDate = moment({y: picker.date.year(), M: picker.date.month()});
	                fillDate();
	                fillTime();
	            }
	            else {
	                notifyError(newDate);
	            }
	        };

	        picker.getDate = function () {
	            if (picker.unset) {
	                return null;
	            }
	            return moment(picker.date);
	        };

	        picker.setDate = function (date) {
	            var oldDate = moment(picker.date);
	            if (!date) {
	                picker.setValue(null);
	            } else {
	                picker.setValue(date);
	            }
	            notifyChange(oldDate, 'function');
	        };

	        picker.setDisabledDates = function (dates) {
	            picker.options.disabledDates = indexGivenDates(dates);
	            if (picker.viewDate) {
	                update();
	            }
	        };

	        picker.setEnabledDates = function (dates) {
	            picker.options.enabledDates = indexGivenDates(dates);
	            if (picker.viewDate) {
	                update();
	            }
	        };

	        picker.setMaxDate = function (date) {
	            if (date === undefined) {
	                return;
	            }
	            if (moment.isMoment(date) || date instanceof Date) {
	                picker.options.maxDate = moment(date);
	            } else {
	                picker.options.maxDate = moment(date, picker.format, picker.options.useStrict);
	            }
	            if (picker.viewDate) {
	                update();
	            }
	        };

	        picker.setMinDate = function (date) {
	            if (date === undefined) {
	                return;
	            }
	            if (moment.isMoment(date) || date instanceof Date) {
	                picker.options.minDate = moment(date);
	            } else {
	                picker.options.minDate = moment(date, picker.format, picker.options.useStrict);
	            }
	            if (picker.viewDate) {
	                update();
	            }
	        };

	        init();
	    };

	    $.fn.datetimepicker = function (options) {
	        return this.each(function () {
	            var $this = $(this),
	                data = $this.data('DateTimePicker');
	            if (!data) {
	                $this.data('DateTimePicker', new DateTimePicker(this, options));
	            }
	        });
	    };

	    $.fn.datetimepicker.defaults = {
	        format: false,
	        pickDate: true,
	        pickTime: true,
	        useMinutes: true,
	        useSeconds: false,
	        useCurrent: true,
	        calendarWeeks: false,
	        minuteStepping: 1,
	        minDate: moment({y: 1900}),
	        maxDate: moment().add(100, 'y'),
	        showToday: true,
	        collapse: true,
	        language: moment.locale(),
	        defaultDate: '',
	        disabledDates: false,
	        enabledDates: false,
	        icons: {},
	        useStrict: false,
	        direction: 'auto',
	        sideBySide: false,
	        daysOfWeekDisabled: [],
	        widgetParent: false
	    };
	}));


/***/ }

});