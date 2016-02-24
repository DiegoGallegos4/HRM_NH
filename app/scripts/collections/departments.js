var app = app || {};

(function(){
	var DepartmentList = Backbone.Collection.extend({
		model: app.Department,

		localStorage: new Backbone.LocalStorage('departments'),

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