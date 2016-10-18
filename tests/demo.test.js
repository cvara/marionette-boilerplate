import assert from 'assert';
import $ from 'jquery';

describe('app element', function() {
	it('should exist in DOM', function() {
		assert.equal($('#app').length, 1);
	});
});
