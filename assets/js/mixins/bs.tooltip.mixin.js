module.exports = {

	ui: {
		'bsTooltip': '[data-toggle="tooltip"]'
	},

	onRender: function(e) {
		this.ui.bsTooltip.tooltip();
	},

	onBeforeDestroy: function() {
		this.ui.bsTooltip.tooltip('destroy');
	}
};