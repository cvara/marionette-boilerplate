var Validation = require('backbone.validation');

module.exports = {
	validateShareForm: function(data) {
		var errors = {};
		if (!Validation.patterns.email.test(data.sender)) {
			errors.sender = t('invalid.email');
		}
		if (!Validation.patterns.email.test(data.recipient)) {
			errors.recipient = t('invalid.email');
		}
		return errors;
	},

	validateSubscribeForm: function(data) {
		var errors = {};
		if (!Validation.patterns.email.test(data.email)) {
			errors.email = t('invalid.email');
		}
		return errors;
	},

	validateContactForm: function(data) {
		var errors = {};
		if (!Validation.patterns.email.test(data.sender)) {
			errors.sender = t('invalid.email');
		}
		if (data.msg.length === 0) {
			errors.msg = t('invalid.contactText');
		}
		return errors;
	}
};