define({
	main: {
		lines: 10, // The number of lines to draw
		length: 18, // The length of each line
		width: 10, // The line thickness
		radius: 26, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: '#777777', // #rgb or #rrggbb
		speed: 1, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'main-spinner', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: '30px', // Top position relative to parent in px
		left: 'auto' // Left position relative to parent in px
	}
});