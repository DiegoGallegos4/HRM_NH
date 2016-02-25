var app = app || {};

(function(){
	app.Employee = Backbone.Model.extend({
		defaults: {
			name: '',
			last_name: '',
			department: '',
		},

		validation: {
			name: {
				required: true ,
				msg: 'Nombre es requerido'
			}
		}
	});
}())