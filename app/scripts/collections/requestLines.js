var Backbone = require('backbone');
// Import Models
var RequestLine = require('../models/requestLine');

var RequestLineList = Backbone.Collection.extend({
	model: RequestLine,

	url: 'http://localhost:4003/api/requestLines',

	lines: function(id){
		return this.where({requestID: id});
	},

	search: function(phrase){
		if(phrase == '') return this;

		var pattern = new RegExp(phrase,"gi");
		return _(this.filter(function(data){
			return pattern.test(data.get('employeeID'));
		}));
	},

	byTransportation: function(){
		return this.where( {transportationConfirmation: true} );
	}
});

RequestLines = new RequestLineList();

module.exports = RequestLines;

