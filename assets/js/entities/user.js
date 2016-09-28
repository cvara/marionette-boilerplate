var App = require('app');
var Utility = require('common/utility');
var UserValidator = require('entities/validators/user');
var BackboneValidation = require('backbone.validation');
var Settings = require('settings');


App.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {

	Entities.User = Backbone.Model.extend({
		urlRoot: Settings.RootURL + '/users'
	});

	Entities.LoggedUser = Entities.User.extend({
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

	_.extend(Entities.User.prototype, Backbone.Validation.mixin, UserValidator, {
		defaults: {

		}
	});


	var API = {
		getUserEntity: function(user) {
			var defer = $.Deferred();
			if (user instanceof Entities.User) {
				// if (user instanceof Entities.LoggedUser) {
				// 	defer.resolveWith(null, [new Entities.User(user.attributes)]);
				// } else {
					defer.resolveWith(null, [user]);
				// }
			} else {
				var user = new Entities.User({
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
		},

		getLoggedUserEntity: function() {
			var loggedUser = new Entities.LoggedUser();
			var defer = $.Deferred();

			var response = loggedUser.fetch();
			response.done(function() {
				defer.resolveWith(response, [loggedUser]);
			});
			response.fail(function() {
				defer.rejectWith(response, arguments);
			});

			return defer.promise();
		},

		getEmptyUserEntity: function() {
			return new Entities.User();
		},

		createModelFromObject: function(object) {
			return new Entities.User(object);
		}
	};

	App.reqres.setHandler('user:entity', function(user) {
		return API.getUserEntity(user);
	});

	App.reqres.setHandler('loggedUser:entity', function() {
		return API.getLoggedUserEntity();
	});

	App.reqres.setHandler('empty:user:entity', function() {
		return API.getEmptyUserEntity();
	});

	App.reqres.setHandler('user:model:from:object', function(object) {
		return API.createModelFromObject(object);
	});

});

module.exports = App.Entities.User;
