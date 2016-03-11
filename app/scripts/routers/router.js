var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;
// Import Collections
var Users = require('../collections/users');
var Employees = require('../collections/employees');
var Departments = require('../collections/departments');
var Requests = require('../collections/requests');
var Feedings = require('../collections/feedings');
// Import Views
var HomeView = require('../views/HomeView');
var DepartmentsView = require('../views/DepartmentViews/DepartmentsView');
var EmployeesView = require('../views/EmployeeViews/EmployeesView');
var RequestsView = require('../views/RequestViews/RequestsView');
var FeedingsView = require('../views/FeedingViews/FeedingsView');
var TransportationView = require('../views/TransportationViews/TransportationView');
var UserView = require('../views/UserViews/UsersView');
var LoginView = require('../views/LoginView');
var Navbar = require('../views/NavbarView');
var NotFoundView = require('../views/NotFoundView');
var DashboardView = require('../views/DashboardView');


var AppRouter = Backbone.Router.extend({
	routes: {
		''     	         : 'home',
		'home' 		     : 'home',
		'departments'    : 'departments',
		'employees'      : 'employees',
		'requests' 	     : 'requests',
		'feedings'	     : 'feedings',
		'transportation' : 'transportation',
		'user'			 : 'user',
		'login'			 : 'login',
		'dashboard'		 : 'dashboard',
		'*notFound'		 : 'notFound'
	},

	home: function(){
		this.showNav();
		var view = new HomeView();
		this.showView(view);
	},

	dashboard: function(){
		this.showNav();
		var view = new DashboardView();
		this.showView(view);
	},

	departments: function(){
		this.showNav();
		var view = new DepartmentsView({ collection: new Departments() });
		this.showView(view);
	},

	employees: function(){
		this.showNav();
		var view = new EmployeesView({ collection: new Employees()});
		this.showView(view);
	},

	requests: function(){
		this.showNav();
		var view = new RequestsView({collection: new Requests()});
		this.showView(view);
	},

	feedings: function(){
		this.showNav();
		var view = new FeedingsView({collection: new Feedings()});
		this.showView(view);
	},

	transportation: function(){
		this.showNav();
		var view = new TransportationView({collection: new Requests});
		this.showView(view);
	},

	user: function(){
		this.showNav();
		var view = new UserView({collection: new Users()});
		this.showView(view);
	},

	login: function(){
		$('#container').html();
		var view = new LoginView();
		this.showView(view);
	},

	notFound: function(){
		$('#container').html();
		var view = new NotFoundView()
		this.showView(view);
	},

	// Helpers

	showView: function(view){
		 if (this.currentView){
	      this.currentView.clean();
	    }

	    this.currentView = view;
	    this.currentView.render()

	    $('#containerList').html(this.currentView.el);
	},

	showNav: function(){
		this.nav = new Navbar();
		this.nav.render();
	    $('#container').html(this.nav.el);
	}

});

module.exports = AppRouter;
