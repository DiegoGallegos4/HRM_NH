import React from 'react'
import ReactDOM from 'react-dom'
import Backbone from 'backbone'
import PaymentContainer from '../../components/payments';

var PaymentsView = Backbone.View.extend({
	columnTitles: ['Fecha', 'Nombre', 'Precio'],

	initialize: function(attrs){
		this.departments = attrs.departments
		this.collection.sort();
	},

	departmentDict: function(){
		var depts = {}
		this.departments.models.forEach(function(dept){
			depts[dept.get('id')] = dept.get('name');
		})
		return depts;
	},

	render: function(){ 
		ReactDOM.render(
			<PaymentContainer columnTitles={this.columnTitles} feedings={this.collection} departments={this.departmentDict()}/>, 
			$('#containerList').get(0)
		);
	}
})

module.exports = PaymentsView;
