import $ from 'jquery';
import RootViewSetup from 'apps/config/marionette/root.view/setup';

before(function() {
	// runs before all tests in this block

});

after(function() {
	// runs after all tests in this block

});

beforeEach(function() {
	// runs before each test in this block
	$('<div id="app">').prependTo('body');
});

afterEach(function() {
	// runs after each test in this block
	$('#app').remove();
});
