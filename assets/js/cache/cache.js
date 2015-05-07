define([
	'app',
	'entities/user'
], function(App) {

	App.module('Cache', function(Cache, App, Backbone, Marionette, $, _) {

		// The Cache Data
		var Data = Cache.Data = {
			// Logged User
			// null     -> we don't know if user has session with server
			// false    -> we know user has logged out
			// BB Model -> the logged user
			loggedUser: null
		};

		// Flags that indicate when cache is currently requesting stuff from server
		// NOTE: this is used to avoid multiple requests to server in cases when
		// something is already being fetched
		var fetching = {
			loggedUser: false
		};


		// Cache API
		// ------------------
		var API = {
			// Fetches logged user from server
			fetchLoggedUser: function(forceUpdate) {
				if (fetching.loggedUser !== false) {
					return fetching.loggedUser;
				}
				var defer = $.Deferred();
				var promise = defer.promise();
				if (forceUpdate || Data.loggedUser === null) {
					fetching.loggedUser = promise;
					var fetchingLoggedUser = App.request('loggedUser:entity');
					fetchingLoggedUser.done(function(user) {
						// user has session with server
						if (user && user.has('id')) {
							if (Data.loggedUser instanceof Backbone.Model) {
								Data.loggedUser.set(user.attributes);
							} else {
								Data.loggedUser = user;
							}
						}
						// user has no session with server
						else {
							Data.loggedUser = false;
						}
						defer.resolve(Data.loggedUser);
						fetching.loggedUser = false;
					});
					fetchingLoggedUser.fail(function() {
						defer.reject();
					});
				} else {
					defer.resolve(Data.loggedUser);
				}
				return promise;
			},

			// Fetches logged user stored in memory (if any)
			getLoggedUser: function() {
				return Data.loggedUser;
			},

			// Store logged user in memory (used for updating cache from outside this module)
			setLoggedUser: function(user) {
				user = user instanceof Backbone.Model ?	user :
	           			App.request('user:model:from:object', user);

				console.log('Cache: setting logged user: ', user);
				if (Data.loggedUser instanceof Backbone.Model) {
					Data.loggedUser.set(user.attributes);
				} else {
					Data.loggedUser = user;
				}
			},

			// Delete logged user from cache
			deleteLoggedUser: function() {
				Data.loggedUser = false;
			}
		};


		// Event listeners
		// ------------------
		App.on('login', function(user, refresh) {
			console.info('Cache: Storing user after login: ', user);
			API.setLoggedUser(user);
		});

		App.on('logout', function() {
			console.info('Cache: Deleting user after logout.');
			API.deleteLoggedUser();
		});


		// Request handlers
		// ------------------
		App.reqres.setHandler('cache:fetch:logged:user', function(forceUpdate) {
			return API.fetchLoggedUser(forceUpdate);
		});

		App.reqres.setHandler('cache:get:logged:user', function() {
			return API.getLoggedUser();
		});


		// Command handlers
		// ------------------
		App.commands.setHandler('cache:set:logged:user', function(user) {
			API.setLoggedUser(user);
		});

		App.commands.setHandler('cache:delete:logged:user', function() {
			API.deleteLoggedUser();
		});
	});

	return App.Cache;
});