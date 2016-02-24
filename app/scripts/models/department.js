var app = app || {};

(function(){
	app.Department = Backbone.Model.extend({
		defaults: {
			name: 'IT'
		}
	});
}())