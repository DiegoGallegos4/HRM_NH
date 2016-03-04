var app = app || {};

(function(){
	app.DepartmentsView = Backbone.View.extend({

		template: Handlebars.compile( $('#table-improv-template').html() ),

		events: {
			'keypress #new': 'createOnEnter',
			'keyup #search': 'searchName',
			'click #add' : 'showModal'
		},

		tableHeader:[
				{'name':'Nombre'},
				{'name':'Abreviacion'}
		],

		initialize: function(){
			this.collection = app.Departments;
			this.subViews = [];
			this.listenTo(this.collection, 'add', this.addOne);
			this.listenTo(this.collection, 'reset', this.addAll);
			
			this.collection.fetch();
		},

		render: function(){
			this.$el.html( this.template({title: 'Departamentos',header_fields: this.tableHeader}) );
			this.$tbody = this.$('#rows');
			return this;
		},

		showModal: function(e){
			var view = new app.DepartmentModalView({collection: this.collection });
			$('#form-modal').html(view.render().el);
		},

		addOne: function(model){
			var view = new app.DepartmentView({model: model});
			this.subViews.push(view);
			this.$tbody.append( view.render().el );
		},

		addAll: function(){
			this.$tbody.html('');
			this.collection.each(this.addOne, this);
		},

		renderList: function(models){
			this.$tbody.empty();

			models.each(function(model){
				this.addOne(model);
			},this)
		},

		searchName: function(e){
			var phrase = $('#search').val().trim();
			this.renderList(app.Departments.search(phrase));
		}	
	});
	
}());

