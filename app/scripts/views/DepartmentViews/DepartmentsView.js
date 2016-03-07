var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;
var bs = require('bootstrap-sass');
// Import Collections
var Departments = require('../../collections/departments');
// Import Views
var DepartmentView = require('./DepartmentView');
var DepartmentModalView = require('./DepartmentModalView');

DepartmentsView = Backbone.View.extend({

	template: Handlebars.compile( $('#table-improv-template').html() ),

	events: {
		'keypress #new': 'createOnEnter',
		'keyup #filterText': 'filterText',
		'click #add' : 'showModal'
	},

	tableHeader:[
			{'name':'Nombre'},
			{'name':'Abreviacion'}
	],

	initialize: function(){
		this.collection = Departments;
		this.subView = DepartmentView;
		this.modalView = DepartmentModalView;
		this.subViews = [];

		// if(this.collection.size() > 0)
//          	this.collection.each(this.addOne, this);

		this.listenTo(this.collection, 'add', this.addOne);
		this.listenTo(this.collection, 'reset', this.addAll);
		
		this.collection.fetch({reset:true});
	},

	render: function(){
		this.$el.html( this.template({title: 'Departamentos',header_fields: this.tableHeader, filterText: true,addButton:true}) );
		this.$tbody = this.$('#rows');
		return this;
	},

	showModal: function(e){
		var view = new this.modalView({collection: this.collection });
		$('#form-modal').html(view.render().el);
	},

	addOne: function(model){
		var view = new this.subView({model: model});
		this.subViews.push(view);
		this.$('#rows').append( view.render().el );
	},

	addAll: function(){
		this.$tbody.html('');
		this.collection.each(this.addOne, this);
	},

	renderList: function(models){
		this.$tbody.empty();

		models.each(function(model){
			this.addOne(model);
		},this)
	},

	filterText: function(e){
		var phrase = $('#filterText').val().trim();
		this.renderList(this.collection.search(phrase));
	}	
});
	
module.exports = DepartmentsView;

