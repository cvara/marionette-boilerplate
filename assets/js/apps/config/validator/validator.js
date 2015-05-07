define(['backbone.validation'], function() {

	// Custom validators
	_.extend(Backbone.Validation.validators, {
		urlArray: function(value, attr, customValue, model) {
			if (value && customValue) {
				var urlPattern = Backbone.Validation.patterns.url;
				for(var i=0, len=value.length; i<len; i++) {
					if (!urlPattern.test(value[i])) {
						return attr + ' should contain value URLs';
					}
				}
			}
		}
	});

	return ;
});