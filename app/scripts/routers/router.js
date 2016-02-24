var app = app || {};
(function(){
	var ViewManager = {
	    currentView : null,
	    showView : function(view) {
	        if (this.currentView !== null && this.currentView.cid != view.cid) {
	            this.currentView.close();
	        }
	        this.currentView = view;
	        return view.render();
    	}
    };

	var AppRouter = Backbone.Router.extend({
		routes: {
			''     	      : 'home',
			'home' 		  : 'home',
			'departments' : 'departments',
			'employees'   : 'employees',
			'request' 	  : 'request'
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

		loadView: function(view){
			this.view && (this.view.close ? this.view.close() : this.view.remove());
			this.view = view;
			this.view.render();
		},

		showView: function(selector, view) {
		    if (this.currentView)
		        this.currentView.close();
		    $(selector).html(view.render().el);
		    this.currentView = view;
		    return view;
		}


	});

	app.Router = new AppRouter();

	Backbone.history.start();
}())