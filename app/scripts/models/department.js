var Backbone = require('backbone');

var Department = Backbone.Model.extend({
	defaults: {
		name: 'IT'
	}
});

module.exports = Department;