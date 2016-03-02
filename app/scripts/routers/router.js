var app = app || {};
(function(){
	var AppRouter = Backbone.Router.extend({

		routes: {
			''     	      : 'home',
			'home' 		  : 'home',
			'departments' : 'departments',
			'employees'   : 'employees',
			'requests' 	  : 'requests',
			'feedings'	  : 'feedings'
		},

		home: function(){
			new app.HomeView();
		},

		departments: function(){
			new app.DepartmentsView();
		},

		employees: function(){
			new app.EmployeesView();
		},

		requests: function(){
			new app.RequestsView();
		},

		feedings: function(){
			new app.FeedingsView();
		}		

	});

	// var AppRouter = Marionette.AppRouter.extend({
	// 	appRoutes:{
	// 		'home' : 'home'
	// 	},
	// });

	// var Controller = Marionette.Object.extend({
	// 	home: function(){

	// 	}
	// })

	app.Router = new AppRouter();


	Backbone.history.start();
}())