var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;
var moment = require('moment');
var datepicker = require('eonasdan-bootstrap-datetimepicker');
var bs = require('bootstrap-sass');
// Import Collections
var Employees = require('../../collections/employees');
// Import Views
var FeedingView = require('./FeedingView');
var FeedingModalView = require('./FeedingModalView');

var FeedingsView = Backbone.View.extend({
	template: Handlebars.compile( $('#table-improv-template').html() ),

	events:{
		'click #add' : 'showModal',
		'keyup #filterText' : 'filterByText',
		'click #filter': 'filterDate',
		'click #today': 'filterToday'
	},

	header:[
			{'name':''},
			{'name':'Empleado'},
			{'name':'Fecha'},
			{'name':'Jornada'},
			{'name':'Precio'},
			{'name':'<i class="fa fa-check-circle-o"></i>'}
	],

	initialize: function(attrs){
		this.subView = FeedingView;
		this.modalView = FeedingModalView;
		this.employees = attrs.employees;
		
		
		this.listenTo( this.collection, 'add', this.addOne);
		this.listenTo( this.collection, 'reset', this.addAll);

		this.collection.fetch({reset: true});
		this.employees.fetch();
		this.helper;
	},

	render: function(){
		this.$el.html( this.template( {title:'Control de Alimentacion', 
			header_fields: this.header, 
			filterText: true, 
			filterDate: true, 
			addButton:true} ));
		this.$tbody = this.$('#rows');
		this.$('#filterDate').datetimepicker({
			format: 'YYYY/MM/DD'
		});
		return this;
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

	showModal: function(e){
		var view = new this.modalView({collection: this.collection, employees: this.employees});
		$('#form-modal').html(view.render().el);
	},

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

module.exports = FeedingsView;
