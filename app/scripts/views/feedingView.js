var app = app || {};

(function(){
	app.FeedingView = Backbone.View.extend({
		tagName: 'tr',

		className: 'data-row center',

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
			console.log(this.model.get('pin'));
		}
	});
}());