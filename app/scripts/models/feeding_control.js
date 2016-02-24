var app = app || {};

(function(){
	app.feeding_control = Backbone.Model.extend({
		defaults: {
			id: 1,
			employee_id: 2 ,
			quantity: 123.0,
			confirm: false,
			request_id: 2,
			date: ''
		}
	});
}())