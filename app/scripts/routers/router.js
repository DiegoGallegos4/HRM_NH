var app = app || {};
(function(){
	var AppRouter = Backbone.Router.extend({

		routes: {
			''     	         : 'home',
			'home' 		     : 'home',
			'departments'    : 'departments',
			'employees'      : 'employees',
			'requests' 	     : 'requests',
			'feedings'	     : 'feedings',
			'transportation' : 'transportation'
		},

		home: function(){
			var view = new app.HomeView();
			this.showView(view);
		},

		departments: function(){
			var view = new app.DepartmentsView();
			this.showView(view);
		},

		employees: function(){
			var view = new app.EmployeesView();
			this.showView(view);
		},

		requests: function(){
			var view = new app.RequestsView();
			this.showView(view);
		},

		feedings: function(){
			var view = new app.FeedingsView();
			this.showView(view);
		},

		transportation: function(){
			var view = new app.TransportationView();
			this.showView(view);
		},

		showView: function(view){
			 if (this.currentView){
		      this.currentView.clean();
		    }

		    this.currentView = view;
		    this.currentView.render()

		    $('#containerList').html(this.currentView.el);

		}

	});

	app.Router = new AppRouter();


	Backbone.history.start();
}())