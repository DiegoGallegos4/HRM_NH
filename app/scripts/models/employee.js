var Backbone = require('backbone');

Employee = Backbone.Model.extend({
	defaults: {
		name: '',
		lastName: '',
		departmentId: '',
		completeName: '',
		pin: ''
	}
});

module.exports = Employee;

