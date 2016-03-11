var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;

module.exports = Backbone.View.extend({
	template: Handlebars.compile($('#notFound-template').html()),

	render: function(){
		this.$el.html(this.template());
		return this;
	}
});