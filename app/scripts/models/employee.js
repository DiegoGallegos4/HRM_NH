var Backbone = require('backbone');

Employee = Backbone.Model.extend({
	defaults: {
		name: '',
		lastName: '',
		department: '',
		completeName: '',
		pin: ''
	}
});

module.exports = Employee;

