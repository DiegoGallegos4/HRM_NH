var app = app || {};

(function(){
	app.RequestsView = Backbone.View.extend({
		// el: '#containerList',

		template: Handlebars.compile( $('#table-improv-template').html() ),

		events: {
			'click #add' : 'showModal',
			'click #filter': 'filterDate',
			'click #today': 'filterToday'
		},

		header: [
				{'name': 'Razon'},
				{'name': 'Jornada'},
				{'name': 'Fecha'},
				{'name': 'Hora'}
		],

		initialize: function(){
			this.collection = app.Requests;
			this.subView = app.RequestView;
			
			this.listenTo( this.collection, 'add', this.addOne );
			this.listenTo( this.collection, 'reset', this.addAll );
			this.collection.fetch();

			// this.render();
			this.helpers();
		},

		render: function(){
			// this.$el.html('');
			this.$el.html( this.template( {title:'Solicitudes', 
				header_fields: this.header,
				filterDate: true,
				addButton:true} ));
			this.$table = this.$('#rows');
			this.$('#filterDate').datetimepicker({
				format: 'YYYY/MM/DD'
			});
			return this;
		},

		helpers: function(){
			Handlebars.registerHelper('printDate',function(date){
				var current = new Date(date);
				var dd = current.getDate() < 10 ? '0' + current.getDate() : current.getDate();
				var mm = current.getMonth() < 10 ? '0' + (current.getMonth() + 1) : current.getMonth() + 1;
				var yy = current.getFullYear();
				var result = yy+'-'+mm+'-'+dd;
				return result;
			});
		},

		renderList: function(models){
			this.$table.html('');
			var self = this;
			models.forEach(function(model){
				self.addOne(model);
			});
		},

		filterToday: function(){
			var current = new Date();
			var dd = current.getDate() < 10 ? '0' + current.getDate() : current.getDate();
			var mm = current.getMonth() < 10 ? '0' + (current.getMonth() + 1) : current.getMonth() + 1;
			var yy = current.getFullYear();
			var today = yy+'/'+mm+'/'+dd;
			this.renderList(this.collection.filterByDate(today));
		},

		filterDate: function(){
			var date = this.$('#filterDate').val();
			if(date) {
				this.renderList(this.collection.filterByDate(date));
			}
		},

		addOne: function(model){
			var view = new this.subView({model: model});
			this.$table.append( view.render().el );
		},

		addAll: function(){
			this.$table.html('');
			this.collection.each( this.addOne, this );
		},

		showModal: function(e){
			var view = new app.RequestModalView( { collection: this.collection, model: null, title: {name: 'Crear'} });
			Promise.resolve(app.Employees.fetch())
				   .then(function(){
						$('#form-modal').html(view.render().el);
						$('[data-toggle="tooltip"]').tooltip();
					});
		}

	});
}());