var app = app || {};

(function(){
	app.Request = Backbone.Model.extend({
		defaults: {
			id: 1,
			employee_id: 1,
			reason: 'Obras Adicionales',
			hour: '',
			date: '',
			feeding: true,
			transportation: true,
			approved: false,
			transportation_confirm: false
		}
	});
}());