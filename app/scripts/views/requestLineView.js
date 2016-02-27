var app = app || {};

(function(){
	app.RequestLineView = Backbone.View.extend({
		tagName: 'tr',

		template: Handlebars.compile( $('#requestLine-row-template').html() ),

		events: {
			'click .deleteLine': 'delete'
		},

		render: function(){
			app.Employees.fetch();
			this.$el.html( this.template({employees: app.Employees.toJSON()}));
			return this;
		},

		delete: function(){
			this.$el.remove();
		}
	});
}());	