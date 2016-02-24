var app = app || {};

(function(){
	var EmployeeList = Backbone.Collection.extend({
		model: app.Employee,

		localStorage: new Backbone.LocalStorage('employees'),

		search: function(phrase){
			if(phrase == '') return this;

			var pattern = new RegExp(phrase,"gi");
			return _(this.filter(function(data){
				return pattern.test(data.get('name'));
			}));
		}
	});

	app.Employees = new EmployeeList();
}());