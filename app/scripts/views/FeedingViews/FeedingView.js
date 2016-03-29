var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;
var bsvalidator = require('bootstrap-validator');
// Import Collections
var User = require('../../models/user');
// Import Views
var FeedingModalView = require('./FeedingModalView');


var FeedingView = Backbone.View.extend({
	tagName: 'tr',

	className: 'data-row text-center',

	events: {
		'blur .edit': 'save',
		'keypress .edit': 'updateOnEnter',
		'dblclick td': 'edit',
		'click .deleteLine': 'delete',
		'click .update': 'insertPin'
	},

	template: Handlebars.compile( $('#row-feeding-template').html() ),

	initialize: function(attrs){
		this.employees = attrs.employees;
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},

	render: function(){
		var employee = this.employees.get({id: this.model.attributes.employeeID}).attributes.completeName;
		this.model.attributes.employee = employee;
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

	insertPin: function(e){
		var view = new FeedingPinModalView({model: this.model, employees: this.employees});
		$('#form-modal').html(view.render().el);
	}
});

// Pin Modal View 
var FeedingPinModalView = Backbone.View.extend({
	tagName: 'div',

	className: 'modal-dialog',

	template: Handlebars.compile( $('#modal-feedingPin-template').html() ),

	events: {
		'click #check': 'checkPin'
	},

	initialize: function(attrs){
		this.employees = attrs.employees;
		this.employeePIN = this.employees.get({id: this.model.attributes.employeeID}).attributes.pin;	
	},

	render: function(){
		this.$el.html( this.template() );
		this.$form = this.$('#form-feedingPin');
		this.$pin = this.$('#pin');
		this.$form.validator();	

		return this;
	},
	
	checkPin: function(e){
		e.preventDefault();
		
		if( !this.requestID && (this.$pin.val() == this.employeePIN) ){
			this.model.save({confirm: true});
			this.close();
		}else if (this.$pin.val() == this.model.get('pin')){
			this.model.save({confirm: true});
			this.close();
		}else{
			this.$('#lineError')
				.html('PIN incorrecto')
				.show().hide(10000);
		}
	},

	close: function(){
		$('.modal').modal('hide');
		this.$el.detach();
		this.render();
	}
});

module.exports = FeedingView;
