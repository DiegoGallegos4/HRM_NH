var Backbone = require('backbone');

Department = Backbone.Model.extend({
	defaults: {
		name: 'IT'
	}
});

module.exports = Department;