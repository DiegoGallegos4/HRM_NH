var app = app || {};

(function(){
	var RequestList = Backbone.Collection.extend({
		model: app.Request,

		url: 'http://localhost:4003/api/requests'
	});

	app.Requests = new RequestList();
}());