var app = app || {};

(function(){
	app.ModalView = Backbone.View.extend({
		el:'#form-modal',

		template: Handlebars.compile( $('#modal-template').html() ),

		events: {
			'click .btn': 'addEmployee'
		},

		initialize: function(){
			app.Departments.fetch();
		},

		render: function(){
			this.$el.html( this.template( {depts: app.Departments.toJSON()} ));
			this.$form = this.$('#form-employee')
			this.$form.validator();
			return this;
		},

		addEmployee: function(e){
			e.preventDefault();
			var formData = {};
			
			this.$('#form-employee div').children('input').each(function(i,elt){
				if( $(elt).val() != ''){
					formData[elt.id] = $(elt).val();
				}
			}); 
			this.collection.create(formData);

			$('.modal').modal('toggle');
		},

	});
}());