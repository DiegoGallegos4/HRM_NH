var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;
// Import Views
var HomeView = require('../views/HomeView');
var DepartmentsView = require('../views/DepartmentViews/DepartmentsView');
var EmployeesView = require('../views/EmployeeViews/EmployeesView');
var RequestsView = require('../views/RequestViews/RequestsView');
var FeedingsView = require('../views/FeedingViews/FeedingsView');
var TransportationView = require('../views/TransportationViews/TransportationView');

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
		var view = new HomeView();
		this.showView(view);
	},

	departments: function(){
		var view = new DepartmentsView();
		this.showView(view);
	},

	employees: function(){
		var view = new EmployeesView();
		this.showView(view);
	},

	requests: function(){
		var view = new RequestsView();
		this.showView(view);
	},

	feedings: function(){
		var view = new FeedingsView();
		this.showView(view);
	},

	transportation: function(){
		var view = new TransportationView();
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

module.exports = AppRouter;
