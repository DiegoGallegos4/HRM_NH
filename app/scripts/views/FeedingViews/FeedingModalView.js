var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;
var moment = require('moment');
var datepicker = require('eonasdan-bootstrap-datetimepicker');
var bsvalidator = require('bootstrap-validator');
// Import Collections 
var Employees = require('../../collections/employees');

var FeedingModalView = Backbone.View.extend({
	tagName:'div',

	className: 'modal-dialog',

	template: Handlebars.compile( $('#modal-feeding-template').html() ),

	events: {
		'click #save': 'addFeeding',
	},

	initialize: function(attrs){
		this.employees = attrs.employees;
	},

	render: function(){
		this.$el.html( this.template({employees: this.employees.toJSON()}));
		this.$form = this.$('#form-feeding');
		this.$('#date').datetimepicker({
			format: 'YYYY/MM/DD'
		});
		this.$form.validator();		
		return this;
	},

	getEmployeeId: function(key){
		var data = {};
		$('#employees option').each(function(i,el){
			data[$(el).val()] = $(el).data('value');
		});
		return data[key];
	},

	addFeeding: function(e){
		e.preventDefault();

		this.$form.validator('validate');
		var formData = {};
		var invalid = false;
		var self = this;
		this.$('#form-feeding div').children('input').each(function(i,elt){
			if( $(elt).val() != ''){
				formData[elt.id] = $(elt).val();
			}else{
				invalid = true;
			}

			if($(elt).attr('name') === 'employeeID') formData[elt.id] = self.getEmployeeId($(elt).val());
		}); 
		console.log(formData);
		if(!invalid){
			this.collection.create(formData);
			$('.modal').modal('hide');
			this.close();
			this.render();
		};
	},

	close: function(){
		$('.modal').modal('hide');
		this.$el.detach();
		this.render();
	}
});

module.exports = FeedingModalView;
