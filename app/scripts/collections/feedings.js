var _ = require('underscore');
var Backbone = require('backbone');
// Import Models
var Feeding = require('../models/feeding');

var FeedingList = Backbone.Collection.extend({
	model: Feeding,

	url: 'http://localhost:4003/api/feedings',

	search: function(phrase){
		if(phrase == '') return this;

		var pattern = new RegExp(phrase,"gi");
		return _(this.filter(function(data){
			return pattern.test(data.get('employeeID'));
		}));
	},

	filterByDate: function(date){
		if(date == '') return this;
		var ms = []
		this.models.forEach(function(model){
			if(Date.parse(model.get('date')) == Date.parse(date)){
				ms.push(model);
			}
		});
		return ms;
	}
});

Feedings = new FeedingList();

module.exports = Feedings;
