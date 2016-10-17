import BbValidation from 'backbone.validation';

// Custom validators
Object.assign(BbValidation.validators, {
	urlArray: function(value, attr, customValue, model) {
		if (value && customValue) {
			const urlPattern = BbValidation.patterns.url;
			for(let i=0, len=value.length; i<len; i++) {
				if (!urlPattern.test(value[i])) {
					return attr + ' should contain value URLs';
				}
			}
		}
	}
});
