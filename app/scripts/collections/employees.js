var _ = require('underscore');
var Backbone = require('backbone');
// Import Models 
var Employee = require('../models/employee');

var EmployeeList = Backbone.Collection.extend({
	model: Employee,

	url: 'http://localhost:4003/api/employees',

	search: function(phrase){
		if(phrase == '') return this;

		var pattern = new RegExp(phrase,"gi");
		return _(this.filter(function(data){
			return pattern.test(data.get('name')) || pattern.test(data.get('last_name'));
		}));
	}
});

Employees = new EmployeeList();

module.exports = Employees;
