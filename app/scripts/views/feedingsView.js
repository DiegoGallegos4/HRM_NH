var app = app || {};

(function(){
	app.FeedingsView = Backbone.View.extend({
		// el: '#containerList',

		template: Handlebars.compile( $('#table-improv-template').html() ),

		events:{
			'click #add' : 'showModal',
			'keyup #filterText' : 'filterByText',
			'click #filter': 'filterDate',
			'click #today': 'filterToday'
		},

		header:[
				{'name':''},
				{'name':'Empleado'},
				{'name':'Fecha'},
				{'name':'Jornada'},
				{'name':'Precio'},
				{'name':'<i class="fa fa-check-circle-o"></i>'}
		],

		initialize: function(){
			this.collection = app.Feedings;
			this.subView = app.FeedingView;
			this.modalSubView = app.FeedingModalView;
			this.helper;
			
			this.listenTo( this.collection, 'add', this.addOne);
			this.listenTo( this.collection, 'reset', this.addAll);

			this.collection.fetch();
		},

		render: function(){
			// this.$el.html('');
			this.$el.html( this.template( {title:'Control de Alimentacion', 
				header_fields: this.header, 
				filterText: true, 
				filterDate: true, 
				addButton:true} ));
			this.$tbody = this.$('#rows');
			this.$('#filterDate').datetimepicker({
				format: 'YYYY/MM/DD'
			});
			return this;
		},

		addOne: function(model){
			var view = new this.subView({model: model});
			this.$tbody.append( view.render().el );
			$('[data-toggle="tooltip"]').tooltip();
		},

		addAll: function(){
			this.$tbody.html('');
			this.collection.each( this.addOne, this );
		},

		showModal: function(e){
			var view = new this.modalSubView({collection: this.collection});
			Promise.resolve(app.Employees.fetch()).then(function(response){
				$('#form-modal').html(view.render().el);
			});
		},

		renderList: function(models){
			this.$tbody.empty();
			models.each(function(model){
				this.addOne(model);
			},this); 
		},

		renderListDates: function(models){
			this.$tbody.html('');
			var self = this;
			models.forEach(function(model){
				self.addOne(model);
			});
		},

		filterByText: function(){
			var phrase = $('#filterText').val().trim();
			this.renderList( this.collection.search(phrase) );
		},

		filterToday: function(){
			var current = new Date();
			var dd = current.getDate() < 10 ? '0' + current.getDate() : current.getDate();
			var mm = current.getMonth() < 10 ? '0' + (current.getMonth() + 1) : current.getMonth() + 1;
			var yy = current.getFullYear();
			var today = yy+'/'+mm+'/'+dd;
			this.renderListDates(this.collection.filterByDate(today));
		},

		filterDate: function(){
			var date = this.$('#filterDate').val();
			if(date) {
				this.renderListDates(this.collection.filterByDate(date));
			}
		}
	});
}());