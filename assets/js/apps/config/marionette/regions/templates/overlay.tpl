<div class="overlay <%= noHeader ? '!dist, *.less' : '' %>">
	<div class="overlay-header">
		<button type="button" class="close" data-dismiss="overlay">
		<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
		</button>
		<h4 class="overlay-title"><%= title %></h4>
	</div>

	<div class="overlay-body"></div>
</div>
