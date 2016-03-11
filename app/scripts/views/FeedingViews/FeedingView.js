var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;
var bsvalidator = require('bootstrap-validator');
// Import Collections
var User = require('../../models/user');
// Import Views
var FeedingModalView = require('./FeedingModalView');

FeedingView = Backbone.View.extend({
	tagName: 'tr',

	className: 'data-row text-center',

	events: {
		'blur .edit': 'save',
		'keypress .edit': 'updateOnEnter',
		'dblclick td': 'edit',
		'click .deleteLine': 'delete',
		'click .update': 'addPin'
	},

	template: Handlebars.compile( $('#row-feeding-template').html() ),

	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},

	render: function(){
		this.$el.html( this.template(this.model.attributes) );
		$('[data-toggle="tooltip"]').tooltip();
		this.$input = this.$('.edit');
		return this;
	},

	edit: function(){
		this.$el.addClass('editing');
	},

	updateOnEnter: function(e){
		if(e.which == ENTER_KEY) this.save();
	},

	save: function(){
		var price = this.$('.edit').val();
		this.model.save({price: price});
		this.$el.removeClass('editing');
	},

	addPin: function(e){
		var requestID = this.$('td')[0].id
		var view = new FeedingPinModalView({model: this.model, employeeID: employeeID});
		$('#form-modal').html(view.render().el);
	}
});

// Pin Modal View
FeedingPinModalView = Backbone.View.extend({
	tagName: 'div',

	className: 'modal-dialog',

	template: Handlebars.compile( $('#modal-feedingPin-template').html() ),

	events: {
		'click #check': 'checkPin'
	},

	render: function(){
		console.log(this.model.get('pin'));
		this.$el.html( this.template() );
		this.$form = this.$('#form-feedingPin');
		this.$pin = this.$('#pin');
		this.$form.validator();	

		return this;
	},

	verify: function(){

	},

	checkPin: function(e){
		e.preventDefault();
		var self = this;
		if(!this.requestID){
			var user = new User();
			Promise.resolve(user.fetch({id: employeeID})).then(function(user){
				console.log(user.get('pin'));
				if (self.$pin.val() == user.get('pin')){
					self.model.save({confirm: true});
					this.close();
				}else{
					console.log('wrong pin');
				}
			})
		}else{
			if (this.$pin.val() == this.model.get('pin')){
				this.model.save({confirm: true});
				this.close();
			}else{
				console.log('wrong pin');
			}
		}
	},

	close: function(){
		$('.modal').modal('hide');
		this.$el.detach();
		this.render();
	}
});

module.exports = FeedingView;
