var Marionette = require('backbone.marionette');
var Env = require('common/environment');
require('bootstrap');


module.exports = Marionette.Region.extend({

	counter: 0,
	modalIdPrefix: 'modal-',
	modalId: 'modal',

	_setModalId: function() {
		this.counter++;
		this.modalId = this.modalIdPrefix + this.counter;
		return this.modalId;
	},

	_addModalMarkup: function(view) {
		var self = this;
		var el = view.$el;
		var modalTitle = view.getOption('modalTitle') || '';
		var modalClass = view.getOption('modalClass') || 'modal-lg';
		var emptyHeader = modalTitle.length === 0;

		el.addClass('modal-body')
			.wrap('<div id="' + this.modalId + '" class="modal ' + (Env.isMobile.any() ? '' : 'fade') + '" tabindex="-1" role="dialog"></div>')
			.wrap('<div class="modal-dialog ' + modalClass + '"></div>')
			.wrap('<div class="modal-content"></div>');

		var modalHeader = [];
		modalHeader.push(
			'<div class="modal-header">',
			'<button type="button" class="close" data-dismiss="modal">',
			'<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>',
			'</button>',
			'<h4 class="modal-title" id="modal-label">', modalTitle, '</h4>',
			'</div>'
		);
		var headerEl = $(modalHeader.join(''));
		if (emptyHeader) {
			headerEl.addClass('empty');
		}
		el.closest('.modal-content').prepend(headerEl);
	},

	_initModal: function(view) {
		var self = this;
		$('#' + this.modalId)
			.modal()
			.on('shown.bs.modal', function() {
				$('body').addClass('modal-open');
			})
			.on('hidden.bs.modal', function() {
				// Purge listeners on view 'close' events
				self.stopListening(view);
				// properly destroy view inside modal
				view.destroy();
				// don't empty remaining bootstrap markup to allow
				// opening of a modal while another is still active
				// NOTE: the 2 modals still won't overlap
				// self.$el.empty();
			});
		self.listenTo(view, 'cancel', function() {
			this.closeModal();
		});
	},

	showAsModal: function(view) {
		this._setModalId();
		this._addModalMarkup(view);
		this._initModal(view);
	},

	onShow: function(view) {
		this.showAsModal(view);
	},

	// This method is used when other modules wish
	// to close the dialog they have opened
	closeModal: function() {
		if (!!this.currentView) {
			$('#' + this.modalId).modal('hide');
		}
	}
});