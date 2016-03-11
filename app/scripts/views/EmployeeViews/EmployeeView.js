var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;
// Import Collection
var Departments = require('../../collections/departments');
var Employees = require('../../collections/employees');

EmployeeView = Backbone.View.extend({
	tagName: 'tr',

	className: 'data-row text-center',

	events: {
		'blur .edit': 'close',
		'dblclick td': 'edit',
		'keypress .edit' : 'updateOnEnter',
		'click .destroy': 'delete'
	},

	template: Handlebars.compile( $('#employee-row-template').html() ),

	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},

	render: function(){
		this.$el.html( this.template({model: this.model.attributes, departments: this.collection.toJSON() }) );
		this.$input = this.$('.edit');
		return this;
	},

	edit: function(e){
		this.$el.addClass('editing');
	},

	close: function(){
		var editData = {}
		this.$input.each(function(i,elt){
			var key = elt.className.split(' ')[1].split('-')[1]
			editData[key] = $(elt).val();
		})
		console.log(editData);

		if(editData) this.model.save( editData, {wait: true});
		var self = this;
		self.$el.removeClass('editing');		
	},

	updateOnEnter: function(e){
		if(e.which === ENTER_KEY) this.close();
	},

	delete: function(){
		this.model.destroy();
	}
})

module.exports = EmployeeView;
