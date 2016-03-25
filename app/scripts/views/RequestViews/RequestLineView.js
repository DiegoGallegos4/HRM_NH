var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;
// Import Collections
var Feedings = require('../../collections/feedings');

var RequestLineView = Backbone.View.extend({
	tagName: 'tr',

	template: Handlebars.compile( $('#requestLine-row-template').html() ),

	events: {
		'click .deleteLine': 'delete',
		'click input[name="approved"]': 'approveFeeding',
	},

	initialize: function(){
		this.feedings = new Feedings();
		console.log(this.model);
	},

	render: function(){
		this.attrs = this.model ? this.model.attributes: null;
		this.$el.html( this.template({employees: employees.toJSON(), model: this.attrs }));
		return this;
	},

	delete: function(e){
		if (this.model){
			this.model.destroy();
		}else{
			this.$el.remove();
		}
	},

	generateModel: function(model){
		return {
			'employeeID': model.employeeID,
			'date': model.request.date,
			'reqLineId': model.id,
			'requestID': model.request.id
		}
	},

	approveFeeding: function(e){
		if(window.localStorage.profile === 'admin' || window.localStorage.profile === 'sysadmin'){
			var val = $(e.currentTarget).prop('checked');

			$(e.currentTarget).prop('checked', val);
			// Save Feeding
			var feedingModel = this.generateModel(this.model.attributes);
			this.feedings.create(feedingModel)
		}else{
			e.preventDefault();
			$('#lineError')
				.html('Solo Administracion puede aprobar Alimentacion')
				.show().hide(8000);
		}	
	}
});

module.exports = RequestLineView