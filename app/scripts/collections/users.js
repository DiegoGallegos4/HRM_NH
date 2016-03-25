var Backbone = require('backbone');
// Import Model
var User = require('../models/user');

var Users = Backbone.Collection.extend({
	model: User,

	url: 'http://localhost:4003/api/users',
});

module.exports = Users;