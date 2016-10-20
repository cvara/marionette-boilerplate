import Backbone from 'backbone';
import UserValidator from 'data/validators/user';
import BackboneValidation from 'backbone.validation';
import Settings from 'settings';
import fetchCache from 'backbone-fetch-cache';
import Radio from 'backbone.radio';
const GC = Radio.channel('global');


const User = Backbone.Model.extend({
	urlRoot: Settings.RootURL + '/users',

	defaults: {

	}
});

Object.assign(User.prototype, Backbone.Validation.mixin, UserValidator);


const API = {
	getUserEntity: (user) => {
		const defer = $.Deferred();
		if (user instanceof User) {
			defer.resolveWith(null, [user]);
		} else {
			user = new User({
				id: user
			});
			const response = user.fetch();
			response.done(() => {
				defer.resolveWith(response, [user]);
			});
			response.fail(() => {
				defer.rejectWith(response, arguments);
			});
		}
		return defer.promise();
	}
};

GC.reply('user:entity', (user) => {
	return API.getUserEntity(user);
});

export default User;
