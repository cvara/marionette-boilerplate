// User Validator
module.exports = {
	validation: {
		role: {
			required: true,
			oneOf: ['user', 'admin']
		},
		'user.first_name': {
			required: true,
			msg: 'First Name is required'
		},
		'user.last_name': {
			required: true,
			msg: 'Last Name is required'
		},
		'user.email': [{
			required: true,
			msg: 'Email address is required'
		}, {
			pattern: 'email',
			msg: 'You must enter a valid email address'
		}],
		'password': [{
			// password required only for new users that are not professional clients
			required: function(val, attr, computed) {
				return !Boolean(computed.id) && computed.role !== 'professional client';
			},
			msg: 'Password is required'
		}, {
			equalTo: 'passwordRepeat',
			msg: 'Your passwords do not match'
		}],
		// passwordRepeat: {
		// 	equalTo: 'password',
		// 	msg: 'Your passwords do not match'
		// },
		expertise: {
			minExpertise: 1,
			msg: 'You must choose at least one field of expertise'
		},
		language: {
			minLanguages: 1,
			msg: 'You must choose at least one language'
		},
		linkedIn: {
			required: false,
			pattern: 'url',
			msg: 'Only valid URLs are accepted'
		},
		twitter: {
			required: false,
			pattern: 'url',
			msg: 'Only valid URLs are accepted'
		},
		webPage: {
			required: false,
			pattern: 'url',
			msg: 'Only valid URLs are accepted'
		},
		phone: [{
			// phone required only for  professional clients
			required: function(val, attr, computed) {
				return computed.role === 'professional client';
			}
		}, {
			pattern: /^(\s)*\+?[0-9\s]+$/,
			msg: 'A valid phone number is required'
		}],
		someAttribute: 'customValidator'
	},

	customValidator: function(value, attr, computedState) {
		if (this.get('role') === 'content creator' &&
			this.has('writer') && !this.get('writer') &&
			this.has('editor') && !this.get('editor') &&
			this.has('proofReader') && !this.get('proofReader')) {
			return 'You must choose at least one role';
		}
	}
};