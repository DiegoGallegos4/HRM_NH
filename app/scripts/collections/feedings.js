var app = app || {};

(function(){
	var FeedingList = Backbone.Collection.extend({
		model: app.FeedingControl,

		url: 'http://localhost:4003/api/feedings'
	});

	app.Feedings = new FeedingList();
}());