var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;
var bsvalidator = require('bootstrap-validator');

DepartmentModalView = Backbone.View.extend({
	tagName:'div',
	className: 'modal-dialog',

	template: Handlebars.compile( $('#modal-template-department').html() ),

	events: {
		'click #save': 'addDepartment'
	},

	render: function(){
		this.$el.html(this.template());
		this.$form = this.$('#form-department');
		this.$form.validator();
		return this;
	},

	addDepartment: function(e){
		e.preventDefault();
		e.stopPropagation();

		this.$form.validator('validate');
		var formData = {};
		var invalid = false;
		this.$('#form-department div').children('input').each(function(i,elt){
			if( $(elt).val() != ''){
				formData[elt.id] = $(elt).val();
			}else{
				invalid = true;
			}
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

module.exports = DepartmentModalView;
