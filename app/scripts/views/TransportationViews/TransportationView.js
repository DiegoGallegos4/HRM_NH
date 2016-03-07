var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;
var moment = require('moment');
var datepicker = require('eonasdan-bootstrap-datetimepicker');
// Import Collections
var Requests = require('../../collections/requests');
var RequestLines = require('../../collections/requestLines');
// Import Views
var TransportationLineView = require('./TransportationLineView');


TransportationView = Backbone.View.extend({
	template: Handlebars.compile( $('#table-improv-template').html() ),

	events: {
		'click #today': 'filterToday',
		'click #filter': 'filterDate',
		'keyup #filterText': 'filterByText'
	},

	header: [
			{'name': 'Empleado'},
			{'name': 'Transporte Normal'},
			{'name': 'Transporte a Casa'},
			{'name': 'Hora'},
			{'name': 'Fecha'}
	],

	initialize: function(){
		this.collection = Requests;
		this.collectionLine = RequestLines;
		this.subView = TransportationLineView;
		
		this.listenTo( this.collection, 'add', this.addOne );
		this.listenTo( this.collection, 'reset', this.addAll );

		this.collection.fetch({reset: true});
		this.helpers;
	},

	render: function(){
		this.$el.html( this.template( {title:'Transporte', 
			header_fields: this.header,
			filterText: true,
			filterDate: true
		}));
		this.$table = this.$('#rows');
		this.$('#filterDate').datetimepicker({
			format: 'YYYY/MM/DD'
		});
		return this;
	},

	renderList: function(models){
		this.$table.html('');
		var self = this;
		models.forEach(function(model){
			self.addOne(model);
		});
	},

	filterByText: function(){
		var phrase = $('#filterText').val().trim();
		this.renderList( this.collectionLine.search(phrase) );
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

	generateModel: function(requestModel, rLModel){
		var conditionalHome = (Date.parse('2016/01/01 ' + requestModel.get('hour')) >= 
								  Date.parse('2016/01/01 9:00 PM'));
		var conditionalRegular = (Date.parse('2016/01/01 ' + requestModel.get('hour')) >= 
						     Date.parse('2016/01/01 7:00 PM') && Date.parse('2016/01/01 ' + requestModel.get('hour')) <= Date.parse('2016/01/01 9:00 PM') );
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
		requestLines.forEach(function(rL,i,array){
			if(rL.transportationConfirmation && rL.transportation){
				var newModel = new Backbone.Model( this.generateModel(model,rL) );
				var view = new this.subView({model: newModel});
				this.$table.append( view.render().el );
			}
		},this)			
		
	},

	addAll: function(){
		this.$table.html('');
		this.collection.each( this.addOne, this );
	}
});

module.exports = TransportationView;
