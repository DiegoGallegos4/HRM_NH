var app = app || {};

(function(){
	app.TransportationLineView = Backbone.View.extend({
		tagName: 'tr',

		className: 'data-row text-center',

		template: Handlebars.compile( $('#row-transportation-template').html() ),

		render: function(){
			this.$el.html( this.template(this.model.attributes) );
			return this;
		}
	});
}());


/**
1. Filter by Date **
3. Add field tries to alimentacion **
4. Add RBAC **
5. Caching
**/