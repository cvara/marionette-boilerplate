var Backbone = require('backbone');
var UserValidator = require('entities/validators/user');
var BackboneValidation = require('backbone.validation');
var Settings = require('settings');
var fetchCache = require('backbone-fetch-cache');
var Radio = require('backbone.radio');
var GlobalChannel = Radio.channel('global');


var User = Backbone.Model.extend({
	urlRoot: Settings.RootURL + '/users'
});

_.extend(User.prototype, Backbone.Validation.mixin, UserValidator, {
	defaults: {

	}
});


var API = {
	getUserEntity: function(user) {
		var defer = $.Deferred();
		if (user instanceof User) {
			defer.resolveWith(null, [user]);
		} else {
			var user = new User({
				id: user
			});
			var response = user.fetch();
			response.done(function() {
				defer.resolveWith(response, [user]);
			});
			response.fail(function() {
				defer.rejectWith(response, arguments);
			});
		}
		return defer.promise();
	}
};

GlobalChannel.reply('user:entity', function(user) {
	return API.getUserEntity(user);
});

module.exports = User;
