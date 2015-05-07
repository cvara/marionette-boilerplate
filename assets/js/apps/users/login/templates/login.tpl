<section class="container max-width-xs">
	<div class="page-header">
		<h4>Login</h4>
	</div>

	<form role="form">

		<div class="panel panel-danger hidden">
			<div class="panel-heading">
				<h3 class="panel-title"><span class="icomoon icomoon-warning2"></span>Wrong credentials</h3>
			</div>
			<div class="panel-body">
				Please make sure your username and password are correct
			</div>
		</div>

		<div class="form-group">
			<label for="user[email]">Email</label>
			<div class="input-group">
				<span class="input-group-addon"><span class="icomoon icomoon-at-sign"></span></span>
				<input type="email" class="form-control" name="user[email]" placeholder="example@email.com" value="<%= email %>">
			</div>
			<p class="text-danger validation-error hidden"></p>
		</div>
		<div class="form-group">
			<label for="password">Password</label>
			<div class="input-group">
				<span class="input-group-addon"><span class="icomoon icomoon-key"></span></span>
				<input type="password" class="form-control" name="password" placeholder="Your password">
			</div>
			<p class="text-danger validation-error hidden"></p>
		</div>
		<div class="form-group">
			<button type="button" class="btn btn-success btn-submit">Login</button>
			<button type="button" class="btn btn-success preloader hidden" disabled="disabled">Processing...</button>
			<button type="button" class="btn btn-default btn-cancel">Cancel</button>
		</div>

	</form>

	<p class="help-block">
		Forgot your password?
		<a href="<%= rootUrl %>/reset/recover">Recover it</a>
	</p>

</section>