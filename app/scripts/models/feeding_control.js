var app = app || {};

(function(){
	app.FeedingControl = Backbone.Model.extend({
		defaults: {
			employeeID: '' ,
			price: 0.0,
			confirm: false,
			requestID: '',
			date: '',
			payment: false,
			pin: '',
			feedingType: ''
		}
	});
}());