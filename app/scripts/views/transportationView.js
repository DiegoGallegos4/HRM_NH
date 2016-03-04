var app = app || {};

(function(){
	app.TransportationView = Backbone.View.extend({
		// el: '#containerList',

		template: Handlebars.compile( $('#table-improv-template').html() ),

		events: {
			'click #today': 'filterToday',
			'click #filter': 'filterDate'
		},

		header: [
				{'name': 'Empleado'},
				{'name': 'Transporte Normal'},
				{'name': 'Transporte a Casa'},
				{'name': 'Hora'},
				{'name': 'Fecha'}
		],

		initialize: function(){
			this.collection = app.RequestLines;
			this.subView = app.TransportationLineView;
			
			this.listenTo( this.collection, 'add', this.addOne );
			this.listenTo( this.collection, 'reset', this.addAll );

			this.collection.fetch();
			app.Requests.fetch();
			this.helpers;
		},

		render: function(){
			this.$el.html( this.template( {title:'Transporte', header_fields: this.header} ));
			this.$table = this.$('#rows');
			this.$('#filterDate').datetimepicker({
				format: 'YYYY/MM/DD'
			});
			return this;
		},

		renderList: function(models){
			this.$table.html('')
			models.each(function(model){
				console.log(model);
				this.addOne(null,model);
			},this);
		},

		filterToday: function(){
			var today = Date.now();
			this.renderList(app.Requests.filterByDate(today));
		},

		filterDate: function(){
			var date = this.$('#filterDate').val();
			this.renderList(app.Requests.filterByDate(date));
		},

		generateModel: function(requestModel, model){
			var conditionalHome = (Date.parse('2016/01/01 ' + requestModel.get('hour')) > 
									  Date.parse('2016/01/01 10:00 PM'));
			var conditionalRegular = (Date.parse('2016/01/01 ' + requestModel.get('hour')) < 
							     Date.parse('2016/01/01 10:00 PM'));
			var newModel = {
				'employeeID' : model.get('employeeID'),
				'transportationRegular': conditionalRegular,
				'transportationHome': conditionalHome,
				'hour': requestModel.get('hour'),
				'date': requestModel.get('date')
			};

			return newModel;
		},

		addOne: function(model,r){
			var self = this;
			console.log(r);
			if(r == null){
				Promise.resolve(app.Requests.fetch()).then(function(response){
					var requestModel = app.Requests.get(model.get('requestID'));
					var newModel = new Backbone.Model( self.generateModel(requestModel, model) );
					var view = new self.subView({model: newModel});
					self.$table.append( view.render().el );
				});
			}else{
				
				var newModel = new Backbone.Model( self.generateModel(r, model) );
				var view = new self.subView({model: newModel});
				self.$table.append( view.render().el );
			}
		},

		addAll: function(){
			this.$table.html('');
			this.collection.each( this.addOne, this );
		}
	});
}());