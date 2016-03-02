var app = app || {};

(function(){
	app.EmployeesView = Backbone.View.extend({
		el: '#containerList',

		template: Handlebars.compile( $('#table-improv-template').html() ),

		events:{
			'keypress #new' : 'createOnEnter',
			'keyup #search' : 'search',
			'click #add' : 'showModal'
		},

		header:[
				{'name':'Nombre'},
				{'name':'Apellido'},
				{'name':'Departamento'}
		],

		initialize: function(){
			this.collection = app.Employees;
			this.subView = app.EmployeeView;

			this.listenTo( this.collection, 'add', this.addOne);
			this.listenTo( this.collection, 'reset', this.addAll);
			this.listenTo( this, 'CloseView', this.close);
			this.collection.fetch();

			this.render();
			this.$tbody = this.$('#rows');
		},

		render: function(){
			this.$el.html( this.template( {title:'Empleados', header_fields: this.header} ));
			return this;
		},

		addOne: function(model){
			var view = new this.subView({model: model});
			this.$tbody.append( view.render().el );
		},

		addAll: function(){
			this.$tbody.html('');
			this.collection.each( this.addOne, this );
		},


		showModal: function(e){
			var view = new app.ModalView({collection: this.collection });
			Promise.resolve(app.Departments.fetch()).then(function(response){
				console.log(response);
				$('#form-modal').html(view.render().el);
			})
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