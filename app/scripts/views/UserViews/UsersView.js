var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;
var bs = require('bootstrap-sass');
// Import Collection
var Users = require('../../collections/users');
var Departments = require('../../collections/departments');
// Import Views
var UserModalView = require('./UserModalView');
var UserView = require('./UserView');

var UsersView = Backbone.View.extend({
	template: Handlebars.compile( $('#table-improv-template').html() ),

	events: {
		'click #add' : 'showModal',
	},

	tableHeader:[
			{'name':'Nombre'},
			{'name':'Username'},
			{'name': 'Email'},
			{'name': 'Departamento'},
			{'name': 'Rol'},
			{'name': 'Activo'}
	],

	initialize: function(){
		this.subView = UserView;
		this.modalView = UserModalView;
		this.subViews = [];

		this.listenTo(this.collection, 'add', this.addOne);
		this.listenTo(this.collection, 'reset', this.addAll);
		
		this.collection.fetch({reset:true});
	},

	render: function(){
		this.$el.html( this.template({title: 'Usuarios', 
			header_fields: this.tableHeader, addButton:true}) );
		this.$tbody = this.$('#rows');
		return this;
	},

	showModal: function(e){
		var view = new this.modalView({collection: this.collection});
		Promise.resolve(Departments.fetch()).then(function(response){
			$('#form-modal').html(view.render().el);
		});
	},

	addOne: function(model){
		var view = new this.subView({model: model});
		this.subViews.push(view);
		this.$tbody.append( view.render().el );
	},

	addAll: function(){
		this.$tbody.html('');
		this.collection.each(this.addOne, this);
	}
});

module.exports = UsersView;