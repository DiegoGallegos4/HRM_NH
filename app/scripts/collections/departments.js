var app = app || {};

(function(){
	var DepartmentList = Backbone.Collection.extend({
		model: app.Department,

		url: 'http://localhost:4003/api/departments',

		search: function(phrase){
			if(phrase == '') return this;

			var pattern = new RegExp(phrase,"gi");
			return _(this.filter(function(data){
				return pattern.test(data.get('name'));
			}));
		}
	});

	app.Departments = new DepartmentList();
}());