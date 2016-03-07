var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;

DepartmentView = Backbone.View.extend({
	tagName: 'tr',

	className: 'text-center',

	events: {
		'dblclick td' : 'edit',
		'blur .edit' : 'close',
		'keypress .edit': 'updateOnEnter',
		'click .destroy': 'delete'
	},

	template: Handlebars.compile( $('#row-department-template').html() ),

	initialize: function(){
		this.listenTo( this.model, 'change', this.render);
		this.listenTo( this.model, 'destroy', this.remove);
	},

	render: function(){
		this.$el.html( this.template(this.model.attributes) );
		this.$input = this.$('.edit');
		return this;
	},

	edit: function(e){
		this.$el.addClass('editing');
	},

	close: function(){
		var value = this.$input.val().trim();

		if( value ){
			this.model.save({name: value});
		}

		this.$el.removeClass('editing');
	},

	updateOnEnter: function(e){
		if(e.which === ENTER_KEY) this.close();
	},

	delete: function(){
		this.model.destroy();
	},

	onClose: function(){
		this.model.off('change',this.render);
		this.model.off('destroy',this.remove);
	}
});

module.exports = DepartmentView;