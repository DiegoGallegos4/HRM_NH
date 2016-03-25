var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;

var HomeView = Backbone.View.extend({
	template: Handlebars.compile( $('#home-template').html() ),

	icons: [
		{
			'name' : 'Departmentos',
			'href' : '#departments',
			'icon' : 'building'
		},
		{
			'name' : 'Empleados',
			'href' : '#employees',
			'icon' : 'user'
		},
		{
			'name' : 'Solicitud',
			'href' : '#requests',
			'icon' : 'edit'
		},
		{
			'name' : 'Alimentacion',
			'href' : '#feedings',
			'icon' : 'beer'
		},
		{
			'name' : 'Transporte',
			'href' : '#transportation',
			'icon' : 'bus'
		},
		{
			'name' : 'Pago',
			'href' : '#payments',
			'icon' : 'dollar'
		},
	],

	render: function(){
		this.icons.forEach(function(icon){
			this.$el.append( this.template(icon) );
		},this)
		return this;
	},
});

module.exports = HomeView;