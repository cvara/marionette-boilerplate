import App from 'app';
import Backbone from 'backbone';
import _globalTpl from 'mailer/templates/_global';
import sampleEmailTpl from 'mailer/templates/sample.email';
import Settings from 'settings';
import Radio from 'backbone.radio';
const GC = Radio.channel('global');

const { rootUrl } = Settings;
const mailUrl = rootUrl + '/sendMessage';


const API = {

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
		const senderModel = sender instanceof Backbone.Model ? sender : null;
		const recipientModel = recipient instanceof Backbone.Model ? recipient : null;

		sender = senderModel ? sender.get('user').id : sender;
		recipient = recipientModel ? recipient.get('user').id : recipient;

		const data = {};
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

GC.reply('mail:send', (sender, recipient, body, subject) => {
	return API.sendMail(sender, recipient, body, subject);
});

export default API;
