var app = app || {};

(function(){
	app.FeedingsView = Backbone.View.extend({
		// el: '#containerList',

		template: Handlebars.compile( $('#table-improv-template').html() ),

		events:{
			'click #add' : 'showModal'
		},

		header:[
				{'name':''},
				{'name':'Empleado'},
				{'name':'Fecha'},
				{'name':'Jornada'},
				{'name':'Precio'},
				{'name':'<i class="fa fa-check-circle-o"></i>'}
		],

		initialize: function(){
			this.collection = app.Feedings;
			this.subView = app.FeedingView;
			this.modalSubView = app.FeedingModalView;
			this.helper;
			
			this.listenTo( this.collection, 'add', this.addOne);
			this.listenTo( this.collection, 'reset', this.addAll);

			this.collection.fetch();

			// this.render();
		},

		render: function(){
			// this.$el.html('');
			this.$el.html( this.template( {title:'Control de Alimentacion', header_fields: this.header} ));
			this.$tbody = this.$('#rows');
			return this;
		},

		addOne: function(model){
			var view = new this.subView({model: model});
			this.$tbody.append( view.render().el );
			$('[data-toggle="tooltip"]').tooltip();
		},

		addAll: function(){
			this.$tbody.html('');
			this.collection.each( this.addOne, this );
		},


		showModal: function(e){
			var view = new this.modalSubView({collection: this.collection});
			Promise.resolve(app.Employees.fetch()).then(function(response){
				$('#form-modal').html(view.render().el);
			});
		},

		renderList: function(models){
			this.$tbody.empty();
			models.each(function(model){
				this.addOne(model);
			},this) 
		},

		search: function(){
			var phrase = $('#search').val().trim();
			this.renderList( this.collection.search(phrase) );
		}

	});
}());