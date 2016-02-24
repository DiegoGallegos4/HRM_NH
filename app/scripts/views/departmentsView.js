var app = app || {};

(function(){
	app.DepartmentsView = Backbone.View.extend({
		el: "#containerList",

		template: Handlebars.compile( $('#container-template').html() ),

		events: {
			'keypress #new': 'createOnEnter',
			'keyup #search': 'searchName'
		},

		initialize: function(){
			this.$el.html( this.template({title: 'Departamentos'}) );
			this.$input = this.$('#new');

			this.listenTo(app.Departments, 'add', this.addOne);
			this.listenTo(app.Departments, 'reset', this.addAll);

			app.Departments.fetch();
		},

		addOne: function(model){
			var view = new app.DepartmentView({model: model});
			this.$('#tableList').append( view.render().el );
		},

		addAll: function(){
			this.$('#tableList').html('');
			app.Departments.each(this.addOne, this);
		},

		newAttributes: function(){
			return {
				name: this.$input.val().trim()
			};
		},

		createOnEnter: function(e){
			if(e.which !== ENTER_KEY || !this.$input.val().trim()){
				return;
			}
			app.Departments.create( this.newAttributes());
			this.$input.val('');
		},

		renderList: function(models){
			this.$('#tableList').empty();

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

