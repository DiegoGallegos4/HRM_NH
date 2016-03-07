var Backbone = require('backbone');

app.User = Backbone.Model.extend({
	defaults: {
		name: '',
		lastName: '',
		username: '',
		email:'',
		department: '',
		active: true,

	},

	urlRoot: 'http://localhost:4003/api/user'
});

module.exports = User;