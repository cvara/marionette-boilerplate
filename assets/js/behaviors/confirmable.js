import Mn from 'backbone.marionette';

export default Mn.Behavior.extend({

	defaults: {
		message: 'Are you sure?'
	},

	events: {
		'click .js-confirm': 'confirm'
	},

	confirm: function(e) {
		e.preventDefault();
		e.stopPropagation();
		var message = this.options.message;
		if (typeof(this.options.message) === 'function') {
			message = this.options.message(this.view);
		}
		if (confirm(message)) {
			this.view.trigger(this.options.event, this.view.model);
		}
	}
});
