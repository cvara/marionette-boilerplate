import Validation from 'backbone.validation';

export default {
	validateShareForm(data) {
		const errors = {};
		if (!Validation.patterns.email.test(data.sender)) {
			errors.sender = t('invalid.email');
		}
		if (!Validation.patterns.email.test(data.recipient)) {
			errors.recipient = t('invalid.email');
		}
		return errors;
	},

	validateSubscribeForm(data) {
		const errors = {};
		if (!Validation.patterns.email.test(data.email)) {
			errors.email = t('invalid.email');
		}
		return errors;
	},

	validateContactForm(data) {
		const errors = {};
		if (!Validation.patterns.email.test(data.sender)) {
			errors.sender = t('invalid.email');
		}
		if (data.msg.length === 0) {
			errors.msg = t('invalid.contactText');
		}
		return errors;
	}
};
