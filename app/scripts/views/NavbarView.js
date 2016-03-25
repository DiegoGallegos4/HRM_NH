var Backbone = require('backbone');
var Handlebars = require('handlebars');
var React = require('react');

var NavbarView = Backbone.View.extend({
	template: Handlebars.compile( $('#navbar-template').html() ),

	events: {
		'click #menu' : 'showSidebar',
	},

	initialize: function(){
		this.sidebar = new Sidebar;
		$('body').bind('click',this.closeSidebar);

	},

	render: function(){
		this.profile = window.localStorage.profile
		$('body').prepend( this.sidebar.render().el );
		this.$el.html( this.template({profile: this.profile, allowedRole: 'sysadmin'}))
		return this;
	},

	showSidebar: function(e){
		e.stopPropagation();
		$('#drawer').toggleClass('open');
	},

	closeSidebar: function(e){
		$('#drawer').removeClass('open');
	}
});

var Sidebar = Backbone.View.extend({
	template: Handlebars.compile( $('#sidebar-template').html() ),

	initialize: function(){
		if(window.localStorage.prof){
			this.profile = JSON.parse(window.localStorage.prof);
		}
	},

	render: function(){
		this.$el.html( this.template({profile: this.profile}) );
		return this;
	}
})

module.exports = NavbarView;