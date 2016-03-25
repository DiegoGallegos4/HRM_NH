var Backbone = require('backbone');

var Employee = Backbone.Model.extend({
	defaults: {
		name: '',
		lastName: '',
		departmentId: '',
		completeName: '',
		pin: ''
	},

	urlRoot: 'http://localhost:4003/api/employees',
});

module.exports = Employee;

