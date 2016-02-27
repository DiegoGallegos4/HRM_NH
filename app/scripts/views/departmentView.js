var app = app || {};

(function(){
	app.DepartmentView = Backbone.View.extend({
		tagName: 'tr',

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
			//this.$input.focus();
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
		}
	})
}())