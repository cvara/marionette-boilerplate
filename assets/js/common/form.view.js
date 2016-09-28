// Form View
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
var Marionette = require('backbone.marionette');
var App = require('app');
var moment = require('moment');
var syphon = require('backbone.syphon');
var bootstrapDatetimepicker = require('bootstrap-datetimepicker');


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
	submitButton    : '.js-submit',
	cancelButton    : '.js-cancel',
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
		// $('html, body').animate({ scrollTop: 0 });
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