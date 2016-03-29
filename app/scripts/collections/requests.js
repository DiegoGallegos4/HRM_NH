var _ = require('underscore');
var Backbone = require('backbone');
// Import Models
var Request = require('../models/request');

var Requests = Backbone.Collection.extend({
	model: Request,

	url: 'http://localhost:4003/api/requests',

	filterByDate: function(date){
		if(date == '') return this.models;

		var ms = [];
		this.models.forEach(function(model){
			if(Date.parse(model.get('date')) == Date.parse(date)){
				ms.push(model);
			}
		});
		
		return ms
	}
});
window.Requests = Requests;
module.exports = Requests;