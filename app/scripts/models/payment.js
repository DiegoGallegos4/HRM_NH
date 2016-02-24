var app = app || {};

(function(){
	app.Payment = Backbone.Model.extend({
		defaults: {
			employee_id: 1,
			quantity: 123.0,
			feeding_id: 2
		}
	})
}());