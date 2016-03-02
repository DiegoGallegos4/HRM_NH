var app = app || {};

(function(){
	app.FeedingModalView = Backbone.View.extend({
		tagName:'div',

		className: 'modal-dialog',

		template: Handlebars.compile( $('#modal-feeding-template').html() ),

		events: {
			'click #save': 'addFeeding',
		},

		render: function(){
			this.$el.html( this.template({employees: app.Employees.toJSON()}));
			this.$form = this.$('#form-feeding');
			this.$('#date').datetimepicker({
				format: 'YYYY/MM/DD'
			});		
			return this;
		},

		addFeeding: function(){

		},

		close: function(){
			$('.modal').modal('hide');
			this.$el.detach();
			this.render();
		}
	});
}())