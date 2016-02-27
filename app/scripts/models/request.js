var app = app || {};

(function(){
	app.Request = Backbone.Model.extend({
		defaults: {
			reason: 'Obras Adicionales',
			date: '',
			hour: ''
		},

		urlRoot: 'http://localhost:4003/api/requests',

		idAttribute: 'id'
	});
}());