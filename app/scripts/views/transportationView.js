var app = app || {};

(function(){
	app.TransportationView = Backbone.View.extend({
		// el: '#containerList',

		template: Handlebars.compile( $('#table-improv-template').html() ),

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

			// this.render();
			this.helpers;
		},

		render: function(){
			// this.$el.html('');
			this.$el.html( this.template( {title:'Transporte', header_fields: this.header} ));
			this.$table = this.$('#rows');
			return this;
		},

		addOne: function(model){
			var self = this;
			Promise.resolve(app.Requests.fetch()).then(function(response){
				return app.Requests.get(model.get('requestID'));
			}).then(function(requestModel){
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
				return new Backbone.Model(newModel);
			}).then(function(newModel){
				var view = new self.subView({model: newModel});
				self.$table.append( view.render().el );
			});
		},

		addAll: function(){
			this.$table.html('');
			this.collection.each( this.addOne, this );
		}
	});
}());