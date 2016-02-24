var app = app || {};

(function(){

	app.HomeView = Backbone.View.extend({
		el:'#containerList',

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
				'href' : '#request',
				'icon' : 'edit'
			},
			{
				'name' : 'Alimentacion',
				'href' : '#feeding',
				'icon' : 'beer'
			},
			{
				'name' : 'Transporte',
				'href' : '#transport',
				'icon' : 'bus'
			},
			{
				'name' : 'Pago',
				'href' : '#payment',
				'icon' : 'dollar'
			},
		],

		render: function(){
			this.icons.forEach(function(icon){
				this.$el.append( this.template(icon) );
			},this)
			return this;
		}
	});

}());