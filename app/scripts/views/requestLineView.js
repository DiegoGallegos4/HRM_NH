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
			this.attrs = this.model ? this.model.attributes: null;
			this.$el.html( this.template({employees: app.Employees.toJSON(), model: this.attrs }));
			return this;
		},

		delete: function(model){
			this.model.destroy();
		},

		onClose: function(){
			this.model.off('change',this.render);
			this.model.off('destroy',this.remove);
			console.log('unbinding');
		}
	});
}());	