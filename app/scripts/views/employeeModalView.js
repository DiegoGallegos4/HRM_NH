var app = app || {};

(function(){
	app.ModalView = Backbone.View.extend({
		tagName:'div',
		className: 'modal-dialog',

		template: Handlebars.compile( $('#modal-template-employee').html() ),

		events: {
			'click #save': 'addEmployee'
		},

		initialize: function(){
			app.Departments.fetch();
		},

		render: function(){
			this.$el.html( this.template( {depts: app.Departments.toJSON()} ));
			this.$form = this.$('#form-employee');
			this.$form.validator();
			return this;
		},

		addEmployee: function(e){
			e.preventDefault();

			this.$form.validator('validate');
			var formData = {};
			var invalid = false;
			this.$('#form-employee div').children('input').each(function(i,elt){
				if( $(elt).val() != ''){
					formData[elt.id] = $(elt).val();
				}else{
					invalid = true;
				}
			}); 

			if(formData['name'] && formData['lastName']) formData['completeName'] = formData['name'] + ' ' + formData['lastName'];

			if(!invalid){
				this.collection.create(formData);
				$('.modal').modal('hide');
				this.close();
				this.render();
			};
		},

		close: function(){
			this.$el.detach();
		}
	});
}());