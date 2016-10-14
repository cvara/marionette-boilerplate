import ShowController from './show/controller';
import Radio from 'backbone.radio';
const GC = Radio.channel('global');


// Header API
// ------------------
const API = {
	showHeader: () => {
		ShowController.showHeader();
	}
};


// Event Listeners
// ------------------
GC.on('header:render', () => {
	API.showHeader();
});

GC.on('login', (user, refresh) => {
	API.showHeader();
});

GC.on('logout', () => {
	API.showHeader();
});

export default API;
