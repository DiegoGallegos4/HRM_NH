var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;
var bs = require('bootstrap-sass');
// Import Collections
var Employees = require('../../collections/employees');
var Departments = require('../../collections/departments');
// Import Views
var EmployeeView = require('./EmployeeView');
var EmployeeModalView = require('./EmployeeModalView');

EmployeesView = Backbone.View.extend({
	template: Handlebars.compile( $('#table-improv-template').html() ),

	events:{
		'keypress #new' : 'createOnEnter',
		'keyup #filterText' : 'filterByText',
		'click #add' : 'showModal'
	},

	header:[
			{'name':'Nombre'},
			{'name':'Apellido'},
			{'name':'Departamento'}
	],

	initialize: function(){
		this.collection = Employees;
		this.subView = EmployeeView;
		this.modalView = EmployeeModalView;

		this.listenTo( this.collection, 'add', this.addOne);
		this.listenTo( this.collection, 'reset', this.addAll);
		this.collection.fetch({reset: true});
	},

	render: function(){
		this.$el.html( this.template( {title:'Empleados', header_fields: this.header, filterText: true, addButton:true} ));
		this.$tbody = this.$('#rows');
		return this;
	},

	addOne: function(model){
		var view = new this.subView({model: model});
		this.$tbody.append( view.render().el );
	},

	addAll: function(){
		this.$tbody.html('');
		this.collection.each( this.addOne, this );
	},


	showModal: function(e){
		var view = new this.modalView({collection: this.collection });
		Promise.resolve(Departments.fetch()).then(function(response){
			console.log(response);
			$('#form-modal').html(view.render().el);
		})
	},

	renderList: function(models){
		this.$tbody.empty();
		models.each(function(model){
			this.addOne(model);
		},this) 
	},

	filterByText: function(){
		var phrase = $('#filterText').val().trim();
		this.renderList( this.collection.search(phrase) );
	}
});

module.exports = EmployeesView;
