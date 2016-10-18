import assert from 'assert';
import RootViewSetup from 'apps/config/marionette/root.view/setup';
import Mn from 'backbone.marionette';

describe('root.view', function() {
	beforeEach(function() {
		this.view = RootViewSetup('#app');
	});

	it('setups correctly', function() {
		assert(this.view instanceof Mn.View);
	});

	it('has needed regions', function() {
		const regions = ['header', 'main', 'dialog', 'loading', 'overlay'];
		regions.forEach(region => {
			assert(this.view.getRegion(region) instanceof Mn.Region);
		});
	});
});
