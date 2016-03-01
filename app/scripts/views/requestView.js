var app = app || {};

(function(){
	app.RequestView = Backbone.View.extend({
		tagName: 'tr',

		className: 'data-row',

		events: {
			'blur .edit': 'close',
			// 'dblclick td': 'edit',
			'keypress .edit' : 'updateOnEnter',
			'click .deleteLine': 'delete',
			'click .update': 'update'
		},

		template: Handlebars.compile( $('#row-template-request').html() ),

		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function(){
			this.$el.html( this.template(this.model.attributes) );
			this.$input = this.$('.edit');
			return this;
		},

		update: function(e){
			var requestID = $(e.currentTarget).attr('id');
			var request = new app.Request();

			Promise.resolve(request.fetch(requestID)).then(function(response){
				return response[0];
			}).then(function(json){
				var view = new app.RequestModalView( {collection: app.Requests, model: json, title: {name: 'Editar'}} );
				$('#form-modal').html(view.render().el);
				$('[data-toggle="tooltip"]').tooltip();
			})
		},

		// edit: function(e){
		// 	this.$el.addClass('editing');
		// 	e.stopPropagation();
		// },

		// close: function(){
		// 	var editData = {};
		// 	this.$input.each(function(i,elt){
		// 		editData[elt.className.split(' ')[1].split('-')[1]] = $(elt).val();
		// 	})
		// 	if(editData) this.model.save( editData );
		// 	this.$el.removeClass('editing');
		// },

		// updateOnEnter: function(e){
		// 	if(e.which === ENTER_KEY) this.close();
		// },

		delete: function(){
			this.model.destroy();
		}
	});
}());