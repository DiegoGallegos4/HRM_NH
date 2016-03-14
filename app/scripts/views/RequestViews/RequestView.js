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

RequestView = Backbone.View.extend({
	tagName: 'tr',

	className: 'data-row text-center',

	events: {
		'blur .edit': 'close',
		// 'dblclick td': 'edit',
		'keypress .edit' : 'updateOnEnter',
		'click .deleteLine': 'delete',
		'click .update': 'update'
	},

	template: Handlebars.compile( $('#row-template-request').html() ),

	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
		console.log(this.collection);
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
			var view = new RequestModalView( {collection: self.collection, model: json} );
			$('#form-modal').html(view.render().el);
			$('[data-toggle="tooltip"]').tooltip();
		})
	},

	delete: function(){
		var id = this.model.get('id');
		var self = this;
		Promise.resolve(RequestLines.fetch()).then(function(response){
			var models = RequestLines.lines(id);
			models.forEach(function(elt,i,array){
				elt.destroy();
			})
			return models;
		}).then(function(models){
			self.model.destroy();
		});
	}
});

module.exports = RequestView;
