var App = require('app');
var Env = require('common/environment');

// Article feedback URL
var feedbackUrl = App.request('setting', 'RootURL') + '/adapt';
// Already counted ad impressions
var countedAdImpressions = window.countedAdImpressions = [];
// Analytics enabled only when not on localhost & not opened by a bot
var enableAdAnalytics = !/localhost/.test(location.href) && !Env.isBot();


var Feedback = {

    _isAlreadyCounted: function(adModel, interaction) {
        var found = _.find(countedAdImpressions, function(counted) {
            // Count interaction of same type, for same advert id, withing the same context (page)
            return counted.id === adModel.id && counted.interaction === interaction && counted.context === App.getCurrentRoute();
        });
        return Boolean(found);
    },

    countArticleOpen: function(articleId) {
        var params = {
            article_id: articleId,
            feedback: 1,
            profile: App.request('setting', 'UserProfile')
        };
        return $.post(feedbackUrl, params);
    },

    countArticleShare: function(articleId) {
        var params = {
            article_id: articleId,
            feedback: 3,
            profile: App.request('setting', 'UserProfile')
        };
        return $.post(feedbackUrl, params);
    },

    countAdAppearance: function(adModel) {
        if (!enableAdAnalytics) {
            return;
        }
        console.info('countAdAppearance: ', adModel.id);
        // Parse already stored analytics
        var analytics = adModel.get('analytics') || {};
        // Count appearances for this model
        analytics.appearances = analytics.appearances ? analytics.appearances + 1 : 1;
        // Remove counted impressions for this ad
        countedAdImpressions = _.reject(countedAdImpressions, function(counted) {
            return counted.id === adModel.id;
        });
        // Update the model
        adModel.save({
            analytics: JSON.stringify(analytics)
        }, { patch: true });
        // GA Event for advert serve
        App.trigger(
            'analytics:track:event',
            'advert',
            'serve',
            adModel.get('id') + '-' + (adModel.get('title') || 'untitled'),
            undefined,
            { nonInteraction: true } // does not affect bounce rate
        );
    },

    countAdInteraction: function(adModel, interaction) {
        if (!enableAdAnalytics) {
            return;
        }
        if (Feedback._isAlreadyCounted(adModel, interaction)) {
            return;
        }
        console.info('countAdInteraction: ', adModel.id, interaction);
        // Get analytics object
        var analytics = adModel.get('analytics') || {};
        // Count interaction for this model
        if (analytics[interaction]) {
            analytics[interaction]++;
        } else {
            analytics[interaction] = 1;
        }
        // Calculate conversion for this interaction
        analytics[interaction + '_conversion'] =  (analytics[interaction] / analytics.appearances).toFixed(4);
        // Remember interaction to avoid counting it again
        countedAdImpressions.push({
            id: adModel.id,
            interaction: interaction,
            context: App.getCurrentRoute()
        });
        // Update the model
        adModel.save({
            analytics: JSON.stringify(analytics)
        }, { patch: true });
        // GA Event for advert interactions (views & clicks)
        App.trigger(
            'analytics:track:event',
            'advert',
            interaction, adModel.get('id') + '-' + (adModel.get('title') || 'untitled')
        );
    }
};

App.reqres.setHandler('feedback:count:article:open', function(articleId) {
    return Feedback.countArticleOpen(articleId);
});

App.reqres.setHandler('feedback:count:article:share', function(articleId) {
    return Feedback.countArticleShare(articleId);
});

App.reqres.setHandler('feedback:count:ad:appearance', function(adModel) {
    return Feedback.countAdAppearance(adModel);
});

App.reqres.setHandler('feedback:count:ad:interaction', function(adModel, interaction) {
    return Feedback.countAdInteraction(adModel, interaction);
});

module.exports = Feedback;