var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;
var bsvalidator = require('bootstrap-validator');

UserModalView = Backbone.View.extend({
	tagName:'div',

	className: 'modal-dialog',

	template: Handlebars.compile( $('#modal-user-template').html() ),

	events: {
		'click #save': 'addUser'
	},

	render: function(){
		this.$el.html(this.template({departments: Departments.toJSON()}));
		this.$form = this.$('#form-user');
		this.$form.validator();
		return this;
	},

	addUser: function(e){
		e.preventDefault();
		e.stopPropagation();

		this.$form.validator('validate');
		var formData = {};
		var invalid = false;

		this.$form.serializeArray().forEach(function(elt,i,arr){
			if(elt.value != ''){
				formData[elt.name] = elt.value
			}else{
				invalid = true;
			}
		})

		this.$('input[type=checkbox]').each(function(i, elt){
			formData[elt.id] = $(elt).is(':checked');
		});

		if(!invalid){
			this.collection.create(formData);
			$('.modal').modal('hide');
			this.close();
			this.render();
		};
	},

	close: function(){
		this.$el.detach();
	}
});
module.exports = UserModalView;