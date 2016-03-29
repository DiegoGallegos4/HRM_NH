var _ = require('underscore');
var Backbone = require('backbone');
// Import Models
var Feeding = require('../models/feeding');

var Feedings = Backbone.Collection.extend({
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
		if(date == ''){
			return this.models
		};
		var ms = [];
		this.models.forEach(function(model){
			if(Date.parse(model.get('date')) == Date.parse(date)){
				ms.push(model);
			}
		});
		return ms;
	},

	comparator: function(a,b){
		var a = a.get('employee').department.abbr;
		var b = b.get('employee').department.abbr;
		return   a > b ? 1
			   : a < b ? -1
			   : 0;
	}
});

module.exports = Feedings;
