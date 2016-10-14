import Backbone from 'backbone';
import UserValidator from 'entities/validators/user';
import BackboneValidation from 'backbone.validation';
import Settings from 'settings';
import fetchCache from 'backbone-fetch-cache';
import Radio from 'backbone.radio';
var GC = Radio.channel('global');


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

GC.reply('user:entity', function(user) {
	return API.getUserEntity(user);
});

module.exports = User;
