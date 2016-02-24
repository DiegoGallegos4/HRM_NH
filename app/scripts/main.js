var app = app || {};
var ENTER_KEY = 13;

$(function(){
	//new app.AppView();
	Backbone.View.prototype.close = function () {
	    if (this.beforeClose) {
	        this.beforeClose();
	    }
	    this.remove();
	    this.unbind();
	}	
});