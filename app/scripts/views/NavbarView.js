var Backbone = require('backbone');
var Handlebars = require('handlebars');

NavbarView = Backbone.View.extend({
	template: Handlebars.compile( $('#navbar-template').html() ),

	render: function(){
		this.profile = window.localStorage.profile
		this.$el.html( this.template({profile: this.profile, allowedRole: 'sysadmin'}))
		return this
	}

});

module.exports = NavbarView;