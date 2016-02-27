var app = app || {};
var ENTER_KEY = 13;

$(function(){ 
	Backbone.View.prototype.close = function () {
	    if (this.beforeClose) {
	        this.beforeClose();
	    }
	    this.remove();
	    this.unbind();
	};

	
});