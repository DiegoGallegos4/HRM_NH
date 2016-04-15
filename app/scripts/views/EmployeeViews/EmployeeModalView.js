  var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;
var bsvalidator = require('bootstrap-validator');
// Import Collections
var Departments = require('../../collections/departments');

var EmployeeModalView = Backbone.View.extend({
	tagName:'div',

	className: 'modal-dialog',

	template: Handlebars.compile( $('#modal-template-employee').html() ),

	events: {
		'click #save': 'addEmployee'
	},

	render: function(){
		this.$el.html( this.template( {depts: this.model.toJSON()} ));
		this.$form = this.$('#form-employee');
		this.$form.validator();
		return this;
	},

	addEmployee: function(e){
		e.preventDefault();

		this.$form.validator('validate');
		var formData = {};
		var invalid = false;

		this.$form.serializeArray().forEach(function(elt,i,array){
			if( elt.value != ''){
				formData[elt.name] = elt.value;
			}else{
				invalid = true;
			}
		});

		if(formData['name'] && formData['lastName']) formData['completeName'] = formData['name'] + ' ' + formData['lastName'];

		if(!invalid){
			this.collection.create(formData);
			var self = this
			Promise.resolve( self.collection.fetch({reset: true}) ).then(function(response){
				$('.modal').modal('hide');
				self.close();
				self.render();
			})
		};
	},

	close: function(){
		this.$el.detach();
	}
});

module.exports = EmployeeModalView;
