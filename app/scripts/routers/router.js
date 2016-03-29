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
var RequestLines = require('../collections/requestLines');
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
var PaymentsView = require('../views/PaymentViews/PaymentsView')
// Components
import HelloMessage from '../components/test';
import PaymentContainer from '../components/payments';
// Dependencies
var React = require('react');
var ReactDOM = require('react-dom');

window.PV = PaymentsView;
window.Fd = Feedings;

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
		'logout'		 : 'logout',
		'dashboard'		 : 'dashboard',
		'test'			 : 'test',
		'payments'		 : 'payments',
		'*notFound'		 : 'notFound'
	},

	test: function(){
		ReactDOM.render(<HelloMessage name="Diego" />,$('#main').get(0));
	},

	home: function(){
		this.showNav();
		var view = new HomeView();
		this.checkLogin(view);
	},

	dashboard: function(){
		this.showNav();
		var self = this;
		var employees = new Employees();
		Promise.resolve(employees.fetch()).then(function(response){
			var view = new DashboardView({ collection: new Feedings(), employees: employees});
			self.checkLogin(view);
		})
	},

	departments: function(){
		this.showNav();
		var view = new DepartmentsView({ collection: new Departments() });
		this.checkLogin(view);
	},

	employees: function(){
		this.showNav();
		var view = new EmployeesView({ collection: new Employees()});
		this.checkLogin(view);
	},

	requests: function(){
		this.showNav();
		var view = new RequestsView({collection: new Requests()});
		this.checkLogin(view);
	},

	feedings: function(){
		this.showNav();
		var self = this;
		var employees = new Employees();
		Promise.resolve(employees.fetch()).then(function(response){
			var view = new FeedingsView({collection: new Feedings(),employees: employees});
			self.checkLogin(view);
		});
	},

	transportation: function(){
		this.showNav();
		var view = new TransportationView({collection: new Requests});
		this.checkLogin(view);
	},

	user: function(){
		this.showNav();
		var view = new UserView({collection: new Users()});
		this.checkLogin(view);
	},

	payments: function(){
		this.showNav();
		var feedings = new Feedings();
		var departments = new Departments();
		var self = this;
		Promise.all([feedings.fetch(), departments.fetch()]).then(function(response){
			var view = new PaymentsView({collection: feedings, departments: departments});
			self.checkLogin(view,'react');
		})
	},

	login: function(){
		$('#nav').html('');
		var view = new LoginView();
		this.checkLogin(view);
	},

	logout: function(){
		window.localStorage.token = '';
		this.login()
	},

	notFound: function(){
		$('#containerList').html('');
		var view = new NotFoundView()
		this.checkLogin(view);
	},

	// Helpers
	showView: function(view,flag){
		if(flag !== 'react') $('#containerList').html('');
		if (this.currentView) this.currentView.clean();
	    this.currentView = view;
	    this.currentView.render()
	    if(flag !== 'react') $('#containerList').html(this.currentView.el);
	},

	showNav: function(){
		$('#nav').html('');
		this.nav = new Navbar();
		this.nav.render();
	    $('#nav').html(this.nav.el);
	},

	checkLogin: function(view,flag){
		if(window.localStorage.token !== ''){
			if(view.name !== 'LoginView'){
				this.showView(view,flag);
			}else{
				Backbone.history.navigate('',true)
			}
		}else{
			this.showView(new LoginView());
			Backbone.history.navigate('#login',true)
		}
	}
});

module.exports = AppRouter;
