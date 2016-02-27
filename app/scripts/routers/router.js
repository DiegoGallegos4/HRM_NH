var app = app || {};
(function(){
	var AppRouter = Backbone.Router.extend({
		routes: {
			''     	      : 'home',
			'home' 		  : 'home',
			'departments' : 'departments',
			'employees'   : 'employees',
			'requests' 	  : 'requests'
		},

		home: function(){
			this.loadView(new app.HomeView());
		},

		departments: function(){
			this.loadView(new app.DepartmentsView());
		},

		employees: function(){
			this.loadView(new app.EmployeesView());
		},

		requests: function(){
			this.loadView(new app.RequestsView());
		},		

		loadView: function(view){
			this.view && (this.view.close ? this.view.close() : this.view.remove());
			this.view = view;
			this.view.render();
		},
	});

	app.Router = new AppRouter();

	Backbone.history.start();
}())