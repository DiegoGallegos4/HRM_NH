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

		initialize: function(){

			this.collection = app.Employees;
			this.subView = app.EmployeeView;
			this.header = [
						{'name':'Nombre'},
						{'name':'Apellido'},
						{'name':'Departamento'},
						{'name': 'PIN'}
				];
			this.$el.html( this.template( {title:'Empleados', header_fields: this.header} ));

			this.$input = this.$('#new');
			this.$table = this.$('#rows');
			this.listenTo( this.collection, 'add', this.addOne);
			this.listenTo( this.collection, 'reset', this.addAll);
			this.collection.fetch();
		},

		addOne: function(model){
			var view = new this.subView({model: model});
			this.$table.append( view.render().el );
		},

		addAll: function(){
			this.$table.html('');
			this.collection.each( this.addOne, this );
		},

		newAttributes: function(){
			return {
				name: this.$input.val().trim(),
				last_name: 'Gallegos',
				department: 'IT',
				pin: '1234'
			};
		},

		createOnEnter: function(e){
			if(e.which !== ENTER_KEY || !this.$input.val().trim()) return;

			this.collection.create( this.newAttributes() , {validate:true} );
			this.$input.val(''); 
		},

		showModal: function(e){
			var view = new app.ModalView({collection: this.collection });
			view.render().el
		},

		renderList: function(models){
			this.$table.empty();
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