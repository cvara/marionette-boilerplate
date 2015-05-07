define(['marionette'], function(Marionette) {

    Marionette.Region.Loading = Marionette.Region.extend({

    	loadingRegion: true,

        onShow: function(view) {
            this.$el.show();
        },

        onEmpty: function(view) {
            this.$el.hide();
        }
    });

    return Marionette.Region.Loading;
});