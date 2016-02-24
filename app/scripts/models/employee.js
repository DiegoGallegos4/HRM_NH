var app = app || {};

(function(){
	app.Employee = Backbone.Model.extend({
		defaults: {
			// id: 1,
			name: '',
			last_name: '',
			department: '',
			pin: ''
		},

		validation: {
			name: {
				required: true ,
				msg: 'Nombre es requerido'
			}
		}
	});
}())