var app = app || {};

(function(){
	app.feeding_control = Backbone.Model.extend({
		defaults: {
			employeeID: 2 ,
			quantity: 123.0,
			confirm: false,
			request_id: 2,
			dateConsumed: '',
			payment: ''
		}
	});
}())