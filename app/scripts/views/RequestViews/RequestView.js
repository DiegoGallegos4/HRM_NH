var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;
// Import Models
var Request = require('../../models/request');
// Import Collections
var Requests = require('../../collections/requests');
var Employees = require('../../collections/employees');
var RequestLines = require('../../collections/requestLines');
// Import Views
var RequestModalView = require('./RequestModalView');

var RequestView = Backbone.View.extend({
	tagName: 'tr',

	className: 'data-row text-center',

	events: {
		'blur .edit': 'close',
		'keypress .edit' : 'updateOnEnter',
		'click .deleteLine': 'delete',
		'click .update': 'update'
	},

	template: Handlebars.compile( $('#row-template-request').html() ),

	initialize: function(attrs){
		this.employees = attrs.employees;
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},

	render: function(){
		this.$el.html( this.template(this.model.attributes) );
		this.$input = this.$('.edit');
		return this;
	},

	update: function(e){
		var requestID = $(e.currentTarget).attr('id');
		var request = new Request({id: requestID});
		var self = this;
		Promise.resolve(request.fetch()).then(function(response){
			return response;
		}).then(function(json){
			var view = new RequestModalView( {collection: self.collection, model: json, employees: self.employees } );
			$('#form-modal').html(view.render().el);
			$('[data-toggle="tooltip"]').tooltip();
		})
	},

	delete: function(){
		this.model.destroy();
	}
});

module.exports = RequestView;
