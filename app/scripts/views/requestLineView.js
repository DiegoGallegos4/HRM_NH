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
			this.model = this.model || null;
			this.$el.html( this.template({employees: app.Employees.toJSON(), model: this.model }));
			return this;
		},

		delete: function(){
			this.$el.remove();
		}
	});
}());	