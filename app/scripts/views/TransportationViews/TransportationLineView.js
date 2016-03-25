var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;

var TransportationLineView = Backbone.View.extend({
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

module.exports = TransportationLineView;