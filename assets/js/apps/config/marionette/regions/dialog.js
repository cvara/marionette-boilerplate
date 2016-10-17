import Mn from 'backbone.marionette';
import Env from 'common/environment';
import 'bootstrap';


export default Mn.Region.extend({

	counter: 0,
	modalIdPrefix: 'modal-',
	modalId: 'modal',

	_setModalId: function() {
		this.counter++;
		this.modalId = this.modalIdPrefix + this.counter;
		return this.modalId;
	},

	_addModalMarkup: function(view) {
		const self = this;
		const el = view.$el;
		const modalTitle = view.getOption('modalTitle') || '';
		const modalClass = view.getOption('modalClass') || 'modal-lg';
		const emptyHeader = modalTitle.length === 0;

		el.addClass('modal-body')
			.wrap('<div id="' + this.modalId + '" class="modal ' + (Env.isMobile.any() ? '' : 'fade') + '" tabindex="-1" role="dialog"></div>')
			.wrap('<div class="modal-dialog ' + modalClass + '"></div>')
			.wrap('<div class="modal-content"></div>');

		const modalHeader = [];
		modalHeader.push(
			'<div class="modal-header">',
			'<button type="button" class="close" data-dismiss="modal">',
			'<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>',
			'</button>',
			'<h4 class="modal-title" id="modal-label">', modalTitle, '</h4>',
			'</div>'
		);
		const headerEl = $(modalHeader.join(''));
		if (emptyHeader) {
			headerEl.addClass('empty');
		}
		el.closest('.modal-content').prepend(headerEl);
	},

	_initModal: function(view) {
		$('#' + this.modalId)
			.modal()
			.on('shown.bs.modal', () => {
				$('body').addClass('modal-open');
			})
			.on('hidden.bs.modal', () => {
				// Purge listeners on view 'close' events
				this.stopListening(view);
				// properly destroy view inside modal
				view.destroy();
				// don't empty remaining bootstrap markup to allow
				// opening of a modal while another is still active
				// NOTE: the 2 modals still won't overlap
				// self.$el.empty();
			});
		this.listenTo(view, 'cancel', () => {
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
		if (this.hasView()) {
			$('#' + this.modalId).modal('hide');
		}
	}
});
