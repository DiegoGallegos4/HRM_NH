var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;

UserView = Backbone.View.extend({
	tagName: 'tr',

	className: 'text-center',

	events: {
		'dblclick td' : 'edit',
		'blur .edit' : 'close',
		'keypress .edit': 'updateOnEnter',
		'click .destroy': 'delete',
		'change .active' : 'updateOnClick'
	},

	template: Handlebars.compile( $('#row-user-template').html() ),

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
		var editData = {}
		this.$input.each(function(i,elt){
			editData[elt.className.split(' ')[1].split('-')[1]] = $(elt).val().trim();
		})

		if( editData != {} ){
			this.model.save(editData);
		}

		this.$el.removeClass('editing');
	},

	updateOnEnter: function(e){
		if(e.which === ENTER_KEY) this.close();
	},

	updateOnClick: function(e){
		var value = $(e.currentTarget).is(':checked') ? true : false;
		this.model.save({active: value});
	},

	delete: function(){
		this.model.destroy();
	},

	onClose: function(){
		this.model.off('change',this.render);
		this.model.off('destroy',this.remove);
	}
});

module.exports = UserView;