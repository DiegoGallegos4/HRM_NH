var Backbone = require('backbone');
var Handlebars = require('handlebars');
// Import User
require('oauth-js');
var Users = require('../collections/users');

LoginView = Backbone.View.extend({
	events: {
		'click #authorize-button' : 'onSignIn'
	},

    template: Handlebars.compile( $('#login-template').html() ),

    initialize: function () {
        self = this;
		this.scopes = 'https://www.googleapis.com/auth/userinfo.email';
		this.clientId = '401162567026-o2lhj1kg5gdbe9ukb0pnl01dfacgnhoo.apps.googleusercontent.com';
		this.apiKey = 'jBLZkCH9oyXrRV4ulf3yYyFc';
	},

	render: function(){
		this.$el.html( this.template() );
		this.$el.css({
			'width': '100%',
			'height': '100%',
			'background-image':'url("images/NH.jpg")',
			'background-size':'cover'
		});
		return this;
	},

	onSignIn: function(){
		OAuth.initialize('wRmzXbqO6hPvLii5vG8QMaTO3Ic');
		OAuth.popup('google').done(function(result){
			var token = result.id_token;
			result.me()
			.done(function(response){
				Promise.resolve($.ajax({
					url: 'http://localhost:4003/auth',
					type: 'POST',
					data: {id_token: token, user: response}
				})).then(function(response){
					console.log(response);
					if(response.token){
						window.localStorage.token = response.token;
						Backbone.history.navigate('',true);
					}else{
						Backbone.history.navigate('#login',true);
					}
				}).catch(function(err){
					console.log(err);
				});
			}).fail(function(err){
				console.log(err);
			})
		}).fail(function(err){
			console.log(err);
		})
	}
});

module.exports = LoginView;







