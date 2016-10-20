import Backbone from 'backbone';
import User from './user';
import Radio from 'backbone.radio';
const GC = Radio.channel('global');


const LoggedUser = User.extend({
	// Override sync to use
	// 1. /users/loggedUser : read
	// 2. /users            : create, update, delete, patch
	sync: function(method, model, options) {
		if (method === 'read') {
			options.url = model.url() + '/loggedUser';
		} else {
			options.url = model.url();
		}
		return Backbone.sync(method, model, options);
	}
});


const API = {

	getLoggedUserEntity: () => {
		const loggedUser = new LoggedUser();
		const defer = $.Deferred();

		const response = loggedUser.fetch({
			cache: true
		});
		response.done(() => {
			defer.resolveWith(response, [loggedUser]);
		});
		response.fail(() => {
			defer.rejectWith(response, arguments);
		});

		return defer.promise();
	}
};

GC.reply('loggedUser:entity', () => {
	return API.getLoggedUserEntity();
});

export default LoggedUser;
