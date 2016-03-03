var app = app || {};

(function(){
	app.EmployeeView = Backbone.View.extend({
		tagName: 'tr',
		className: 'data-row text-center',

		events: {
			'blur .edit': 'close',
			'dblclick td': 'edit',
			'keypress .edit' : 'updateOnEnter',
			'click .destroy': 'delete'
		},

		template: Handlebars.compile( $('#row-template-employee').html() ),

		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function(){
			this.$el.html( this.template(this.model.attributes) );

			this.$input = this.$('.edit');
			return this;
		},

		edit: function(e){
			this.$el.addClass('editing');
			e.stopPropagation();
		},

		close: function(){
			var editData = {}
			this.$input.each(function(i,elt){
				editData[elt.className.split(' ')[1].split('-')[1]] = $(elt).val();
			})
			if(editData) this.model.save( editData );
			this.$el.removeClass('editing');
		},

		updateOnEnter: function(e){
			if(e.which === ENTER_KEY) this.close();
		},

		delete: function(){
			this.model.destroy();
		}
	})
}());