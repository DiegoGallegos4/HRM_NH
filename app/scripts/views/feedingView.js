var app = app || {};

(function(){
	app.FeedingView = Backbone.View.extend({
		tagName: 'tr',

		className: 'data-row text-center',

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
			$('[data-toggle="tooltip"]').tooltip();
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
			var view = new app.FeedingPinModalView({model: this.model});
			$('#form-modal').html(view.render().el);
		}
	});

	app.FeedingPinModalView = Backbone.View.extend({
		tagName: 'div',

		className: 'modal-dialog',

		template: Handlebars.compile( $('#modal-feedingPin-template').html() ),

		events: {
			'click #check': 'checkPin'
		},

		render: function(){
			console.log(this.model.get('pin'));
			this.$el.html( this.template() );
			this.$form = this.$('#form-feedingPin');
			this.$pin = this.$('#pin');
			this.$form.validator();	
			return this;
		},

		checkPin: function(e){
			e.preventDefault();
			if (this.$pin.val() == this.model.get('pin')){
				this.model.save({confirm: true});
				this.close();
			}
		},

		close: function(){
			$('.modal').modal('hide');
			this.$el.detach();
			this.render();
		}
	});
}());