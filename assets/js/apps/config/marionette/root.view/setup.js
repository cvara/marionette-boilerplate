import {Body, Layout} from './view';


export default (rootEl) => {
	const body = new Body({rootEl});
	const layout = new Layout();
	body.showChildView('app', layout);
	return layout;
};
