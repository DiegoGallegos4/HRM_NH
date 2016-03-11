var _ = require('underscore');
var Backbone = require('backbone');
// Import Models
var Request = require('../models/request');

var Requests = Backbone.Collection.extend({
	model: Request,

	url: 'http://localhost:4003/api/requests',

	filterByDate: function(date){
		if(date == '') return this;

		return this.where({date: date});
	}
});

module.exports = Requests;