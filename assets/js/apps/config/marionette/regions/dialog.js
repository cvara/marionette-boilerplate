define(['marionette', 'bootstrap'], function(Marionette) {

	Marionette.Region.Dialog = Marionette.Region.extend({

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

			el.addClass('modal-body')
				.wrap('<div id="' + this.modalId + '" class="modal fade" tabindex="-1" role="dialog"></div>')
				.wrap('<div class="modal-dialog ' + modalClass + '"></div>')
				.wrap('<div class="modal-content"></div>');

			var modalHeader = [];
			modalHeader.push(
				'<div class="modal-header">',
				'<button type="button" class="close" data-dismiss="modal">',
				'<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>',
				'</button>',
				'<h4 class="modal-title" id="exampleModalLabel">', modalTitle, '</h4>',
				'</div>'
			);

			el.closest('.modal-content').prepend(modalHeader.join(''));
		},

		_initModal: function(view) {
			var self = this;
			$('#' + this.modalId)
				.modal()
				.on('hidden.bs.modal', function() {
					// properly destroy view inside modal
					view.destroy();

					// don't empty remaining bootstrap markup to allow
					// opening of a modal while another is still active
					// NOTE: the 2 modals still won't overlap
					// self.$el.empty();

					// stop modal app
					require(['app'], function(App) {
						App.stopDialogApp();
					});
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

	return Marionette.Region.Dialog;
});