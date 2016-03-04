var app = app || {};

(function(){
	app.RequestView = Backbone.View.extend({
		tagName: 'tr',

		className: 'data-row text-center',

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
			console.log(requestID)
			Promise.resolve(request.fetch({id: requestID})).then(function(response){
				console.log(response);
				return response[0];
			}).then(function(json){
				var view = new app.RequestModalView( {collection: app.Requests, model: json, title: {name: 'Editar'}} );
				$('#form-modal').html(view.render().el);
				$('[data-toggle="tooltip"]').tooltip();
			})
		},

		delete: function(){
			var id = this.model.get('id');
			var self = this;
			Promise.resolve(app.RequestLines.fetch()).then(function(response){
				var models = app.RequestLines.lines(id);
				models.forEach(function(elt,i,array){
					elt.destroy();
				})
				return models;
			}).then(function(models){
				self.model.destroy();
			});
		}
	});
}());