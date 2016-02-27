var app = app || {};

(function(){
	app.Employee = Backbone.Model.extend({
		defaults: {
			name: '',
			lastName: '',
			department: '',
			completeName: ''
		}
	});
}())