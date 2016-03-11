var _ = require('underscore');
var Backbone = require('backbone');
// Import Model
var Department = require('../models/department');

var Departments = Backbone.Collection.extend({
	model: Department,

	url: 'http://localhost:4003/api/departments',

	search: function(phrase){
		if(phrase == '') return this;

		var pattern = new RegExp(phrase,"gi");
		return _(this.filter(function(data){
			return pattern.test(data.get('name'));
		}));
	}
});

module.exports = Departments;


