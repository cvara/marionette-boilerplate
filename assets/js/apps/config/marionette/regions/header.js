define(['marionette'], function(Marionette) {

    Marionette.Region.Header = Marionette.Region.extend({

    	pageWrap: $('#page-wrap'),

        onShow: function(view) {
        	this.pageWrap.addClass('with-header');
        },

        onEmpty: function(view) {
        	this.pageWrap.removeClass('with-header');
        }
    });

    return Marionette.Region.Header;
});