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
			this.collection = app.Requests;
			this.subView = app.TransportationLineView;
			
			this.listenTo( this.collection, 'add', this.addOne );
			this.listenTo( this.collection, 'reset', this.addAll );

			this.collection.fetch();
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
				this.addOne(model);
			},this);
		},

		filterToday: function(){
			var current = new Date();
			var dd = current.getDate() < 10 ? '0' + current.getDate() : current.getDate();
			var mm = current.getMonth() < 10 ? '0' + (current.getMonth() + 1) : current.getMonth() + 1;
			var yy = current.getFullYear();
			var today = yy+'/'+mm+'/'+dd;
			this.renderList(app.Requests.filterByDate(today));
		},

		filterDate: function(){
			var date = this.$('#filterDate').val();
			if(date) this.renderList(app.Requests.filterByDate(date));
		},

		generateModel: function(requestModel, rLModel){
			var conditionalHome = (Date.parse('2016/01/01 ' + requestModel.get('hour')) > 
									  Date.parse('2016/01/01 10:00 PM'));
			var conditionalRegular = (Date.parse('2016/01/01 ' + requestModel.get('hour')) < 
							     Date.parse('2016/01/01 10:00 PM'));
			var newModel = {
				'employeeID' : rLModel['employeeID'],
				'transportationRegular': conditionalRegular,
				'transportationHome': conditionalHome,
				'hour': requestModel.get('hour'),
				'date': requestModel.get('date')
			};

			return newModel;
		},

		addOne: function(model){
			var requestLines = model ? model.attributes.requestLines: [];
			console.log(model);
			requestLines.forEach(function(rL,i,array){
				var newModel = new Backbone.Model( this.generateModel(model,rL) );
				var view = new this.subView({model: newModel});
				this.$table.append( view.render().el );
			},this)			
			
		},

		addAll: function(){
			this.$table.html('');
			this.collection.each( this.addOne, this );
		}
	});
}());