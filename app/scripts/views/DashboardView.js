var Backbone = require('backbone');
var Handlebars = require('handlebars');
var moment = require('moment');
var datepicker = require('eonasdan-bootstrap-datetimepicker');
// Import Collections
var Feedings = require('../collections/feedings');

var DashboardView = Backbone.View.extend({
	template: Handlebars.compile( $('#table-improv-template').html() ),

	header:[
			{'name':'Empleado'},
			{'name':'Fecha'},
			{'name':'Jornada'},
			{'name':'PIN'},
			{'name':'Confirmado'}
	], 

	initialize: function(attrs){
		this.subView = MyRequestsView;
		this.employees = attrs.employees
		this.listenTo( this.collection, 'add', this.addOne );
		this.listenTo( this.collection, 'reset', this.addAll );
		this.byCreator();
		this.helpers;
	},

	render: function(){
		this.$el.html( this.template( {title:'Mis Solicitudes', 
			header_fields: this.header, 
			filterText: true, 
			filterDate: true} ));
		this.$tbody = this.$('#rows');
		this.$('#filterDate').datetimepicker({
			format: 'YYYY/MM/DD'
		});
		return this;	
	},
	
	// Fetch Collection filter by creator
	byCreator: function(){
		var self = this;
		this.collection.fetch({reset:true}).done(function(response){
			var filterType = _.filter(self.collection.models, function(item){
				return item.get('createdBy') == response.profile.username
			});
			self.collection.reset(filterType);
		});
	},

	addOne: function(model){
		var view = new this.subView({model: model, employees: this.employees});
		this.$tbody.append( view.render().el );
		$('[data-toggle="tooltip"]').tooltip();
	},

	addAll: function(){
		this.$tbody.html('');
		this.collection.each( this.addOne, this );
	},

	// Filter Methods
	renderList: function(models){
		this.$tbody.empty();
		models.each(function(model){
			this.addOne(model);
		},this); 
	},

	renderListDates: function(models){
		this.$tbody.html('');
		var self = this;
		models.forEach(function(model){
			self.addOne(model);
		});
	},

	filterByText: function(){
		var phrase = $('#filterText').val().trim();
		this.renderList( this.collection.search(phrase) );
	},

	filterToday: function(){
		var current = new Date();
		var dd = current.getDate() < 10 ? '0' + current.getDate() : current.getDate();
		var mm = current.getMonth() < 10 ? '0' + (current.getMonth() + 1) : current.getMonth() + 1;
		var yy = current.getFullYear();
		var today = yy+'/'+mm+'/'+dd;
		this.renderListDates(this.collection.filterByDate(today));
	},

	filterDate: function(){
		var date = this.$('#filterDate').val();
		this.renderListDates(this.collection.filterByDate(date));
	}
});

var MyRequestsView = Backbone.View.extend({
	tagName: 'tr',

	className: 'text-center',

	template: Handlebars.compile( $('#myRequests-row-template').html() ),

	events: {
		'click .deleteLine': 'delete'
	},

	initialize: function(attrs){
		this.employees = attrs.employees;
		this.model.attributes.employee = this.employees.get({id: this.model.attributes.employeeID}).attributes.completeName;
	},

	render: function(attrs){
		this.$el.html( this.template({ model: this.model.attributes }));
		return this;
	},

	onClose: function(){
		this.model.off('change',this.render);
		this.model.off('destroy',this.remove);
	}
});


module.exports = DashboardView;