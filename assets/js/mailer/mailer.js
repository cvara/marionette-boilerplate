define([
	'app',
	'tpl!mailer/templates/_global',
	'tpl!mailer/templates/sample.email'
], function(
	App,
	_globalTpl,
	sampleEmailTpl
) {

	App.module('MailerApp', function(MailerApp, App, Backbone, Marionette, $, _) {

		var rootUrl = App.request('setting', 'RootURL');
		var mailUrl = rootUrl + '/sendMessage';

		var API = {

			_addEmailTheme: function(msg) {
				return _globalTpl({
					emailBody: msg
				});
			},

			_preformat: function(msg) {
				return '<pre>' + msg + '</pre>';
			},

			_addDetails: function(msg, sender, recipient) {
				return 'Message sent from ' +
					(sender.getFullName ? sender.getFullName() : sender) +
					' to ' +
					(recipient.getFullName ? recipient.getFullName() : recipient) +
					':\n\n' +
					msg;
			},

			// Generic email sender
			// -------------------------------------------------------------
			// sender {Backbone.Model|string}    -> The user sending the email. If "server", App is considered the sender
			// recipient {Backbone.Model|string} -> The user receiving the email. If "admin", the App admin is the recipient,
			//                                      if any other string, it will be treated as an email
			// body {string}                     -> The body of the message
			// subject {string}                  -> The subject of the message
			sendMail: function(sender, recipient, body, subject) {
				var senderModel = sender instanceof Backbone.Model ? sender : null;
				var recipientModel = recipient instanceof Backbone.Model ? recipient : null;

				sender = senderModel ? sender.get('user').id : sender;
				recipient = recipientModel ? recipient.get('user').id : recipient;

				var data = {};
				data.to_id = recipient;
				data.subject = '[App] ' + (subject || 'no subject');
				data.html = API._addEmailTheme(API._preformat(body));
				// if sender is `server` omit the from_id param
				if (sender !== 'server') {
					data.from_id = sender;
				}

				return $.post(mailUrl, data);
			}
		};

		App.reqres.setHandler('mail:send', function(sender, recipient, body, subject) {
			return API.sendMail(sender, recipient, body, subject);
		});

	});

	return App.MailerApp;
});