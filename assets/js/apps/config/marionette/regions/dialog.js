import Mn from 'backbone.marionette';
import Env from 'common/environment';
import dialogTpl from './templates/dialog';
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

	initModal: function(view) {
		$('#' + this.modalId).modal().on('shown.bs.modal', () => {
			$('body').addClass('modal-open');
		}).on('hidden.bs.modal', () => {
			// Purge listeners on view 'close' events
			this.stopListening(view);
			// Empty region
			this.empty();
			// don't empty remaining bootstrap markup to allow
			// opening of a modal while another is still active
			// NOTE: the 2 modals still won't overlap
			// self.$el.empty();
		});
		this.listenTo(view, 'cancel', () => {
			this.closeModal();
		});
	},

	attachHtml: function(view) {
		const title = view.getOption('modalTitle') || '';
		const className = view.getOption('modalClass') || 'modal-lg';
		const modalId = this._setModalId();
		const fade = !Env.isMobile();

		const html = dialogTpl({ title, className, fade, modalId });

		const $modalEl = $($.parseHTML(html));

		$modalEl.find('.modal-body').append(view.el);

		this.el.appendChild($modalEl[0]);
	},

	onShow: function(self, view) {
		this.initModal(view);
	},

	// This method is used when other modules wish
	// to close the dialog they have opened
	closeModal: function() {
		if (this.hasView()) {
			$('#' + this.modalId).modal('hide');
		}
	}
});
