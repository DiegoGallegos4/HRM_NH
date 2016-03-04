var app = app || {};

(function(){
	app.TransportationLineView = Backbone.View.extend({
		tagName: 'tr',

		className: 'data-row text-center',

		template: Handlebars.compile( $('#row-transportation-template').html() ),

		render: function(){
			if(this.model){
				this.$el.html( this.template(this.model.attributes) );
			}else{
				this.$el.html( this.template() );
			}
			return this;
		}
	});
}());


/**
1. Filter by Date **
4. Add RBAC/OAuth **
**/