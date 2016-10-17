import Mn from 'backbone.marionette';
import HeaderRegion from 'apps/config/marionette/regions/header';
import MainRegion from 'apps/config/marionette/regions/main';
import DialogRegion from 'apps/config/marionette/regions/dialog';
import LoadingRegion from 'apps/config/marionette/regions/loading';
import OverlayRegion from 'apps/config/marionette/regions/overlay';


// The root LayoutView of our app within the context of 'body'
// -------------------------------------------------------------
// Our custom region classes are attached to this LayoutView
// instead of our app object.
export default Mn.View.extend({
	el: 'body',

	regions: {
		header  : HeaderRegion.extend({ el: '#header-region'}),
		main    : MainRegion.extend({el: '#main-region'}),
		dialog  : DialogRegion.extend({el: '#dialog-region'}),
		loading : LoadingRegion.extend({el: '#loading-region'}),
		overlay : OverlayRegion.extend({el: '#overlay-region'})
	}
});
