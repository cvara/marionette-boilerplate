import ShowController from './show/controller';
import Radio from 'backbone.radio';
const GC = Radio.channel('global');

const API = {
	show404() {
		GC.trigger('loader:all:hide');
		ShowController.show404();
	},
	show500() {
		GC.trigger('loader:all:hide');
		ShowController.show500();
	}
};

GC.on('errors:show:404', () => {
	API.show404();
});

GC.on('errors:show:500', () => {
	API.show500();
});

export default API;
