var app = app || {};

(function(){
	var RequestLineList = Backbone.Collection.extend({
		model: app.RequestLine,

		url: 'http://localhost:4003/api/requestLines'
	});

	app.RequestLines = new RequestLineList();
}());