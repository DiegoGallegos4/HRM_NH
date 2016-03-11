var Backbone = require('backbone');

User = Backbone.Model.extend({
	defaults: {
		name: '',
		lastName: '',
		username: '',
		email:'',
		department: '',
		active: true,
		role: ''
	},

	urlRoot: 'http://localhost:4003/api/users'
});

module.exports = User;