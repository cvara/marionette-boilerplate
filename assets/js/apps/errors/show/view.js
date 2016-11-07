import App from 'app';
import Mn from 'backbone.marionette';
import error404Tpl from './templates/404';
import error500Tpl from './templates/500';

export const Error404 = Mn.View.extend({
	template: error404Tpl
});

export const Error500 = Mn.View.extend({
	template: error500Tpl
});

export default {
	Error404,
	Error500
};
