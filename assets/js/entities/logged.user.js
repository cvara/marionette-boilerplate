var Backbone = require('backbone');
var User = require('./user');
var Radio = require('backbone.radio');
var GlobalChannel = Radio.channel('global');


var LoggedUser = User.extend({
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


var API = {

	getLoggedUserEntity: function() {
		var loggedUser = new LoggedUser();
		var defer = $.Deferred();

		var response = loggedUser.fetch({
			cache: true
		});
		response.done(function() {
			defer.resolveWith(response, [loggedUser]);
		});
		response.fail(function() {
			defer.rejectWith(response, arguments);
		});

		return defer.promise();
	}
};

GlobalChannel.reply('loggedUser:entity', function() {
	return API.getLoggedUserEntity();
});

module.exports = LoggedUser;
