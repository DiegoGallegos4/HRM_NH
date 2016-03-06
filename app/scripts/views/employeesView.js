var app = app || {};

(function(){
	app.EmployeesView = Backbone.View.extend({
		// el: '#containerList',

		template: Handlebars.compile( $('#table-improv-template').html() ),

		initialize: function() {
        	dispatcher.on( 'CloseView', this.clean, this );
    	},

		events:{
			'keypress #new' : 'createOnEnter',
			'keyup #filterText' : 'filterByText',
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
			this.collection.fetch();

			// this.render();
			
		},

		render: function(){
			// this.$el.html('');
			this.$el.html( this.template( {title:'Empleados', header_fields: this.header, filterText: true, addButton:true} ));
			this.$tbody = this.$('#rows');
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

		filterByText: function(){
			var phrase = $('#filterText').val().trim();
			this.renderList( this.collection.search(phrase) );
		}

	});
}());