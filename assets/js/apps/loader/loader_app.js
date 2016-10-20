import ShowController from './show/controller';
import Radio from 'backbone.radio';
const GC = Radio.channel('global');

const API = {
	showMainLoader: () => {
		ShowController.showMainLoader();
	},
	hideMainLoader: () => {
		ShowController.hideMainLoader();
	},
	hideAllLoaders: () => {
		ShowController.hideAllLoaders();
	}
};

GC.on('loader:main:show', () => {
	API.showMainLoader();
});

GC.on('loader:main:hide', () => {
	API.hideMainLoader();
});

GC.on('loader:all:hide', () => {
	API.hideAllLoaders();
});

export default API;
