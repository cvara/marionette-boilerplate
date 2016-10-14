import Mn from 'backbone.marionette';
import testTpl from './templates/test';


const View = {};

View.Test = Mn.View.extend({
	className: 'test-container',
	template: testTpl
});

export default View;
