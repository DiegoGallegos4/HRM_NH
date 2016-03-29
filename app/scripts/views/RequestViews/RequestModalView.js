var $ = require('jquery');
var Backbone = require('backbone');
var Handlebars = require('handlebars');
Backbone.$ = $;
var moment = require('moment');
var datepicker = require('eonasdan-bootstrap-datetimepicker');
var bsvalidator = require('bootstrap-validator');
// Import Collections
var RequestLines = require('../../collections/requestLines');
var Employees = require('../../collections/employees');
// Import Views
var RequestLineView = require('./RequestLineView');

var RequestModalView = Backbone.View.extend({
	tagName:'div',

	className: 'modal-dialog',

	template: Handlebars.compile( $('#modal-template-request').html() ),

	templateTable: Handlebars.compile( $('#requestLine-table-template').html() ),

	events: {
		'click #save': 'addRequest',
		'click #add' : 'addNewRow',
		'blur input#hour': 'verifyTransport',
		'click input[name="approved"]': 'approveFeeding',
		'click input[name="transportationConfirmation"]': 'confirmTransportation'
	},

	tableHeader:[
		{name: 'Empleado'},
		{name:'<i class="fa fa-check-circle"></i>' ,tooltip: 'Aprobar'},
		{name: '<i class="fa fa-bus"></i>',tooltip: 'Transporte'},
		{name: '<i class="fa fa-thumbs-o-up"></i>',tooltip: 'Confirmar Transporte'}
	],

	initialize: function(attrs){
		this.collectionLine = RequestLines;
		this.employees = attrs.employees;
		this.subViews = []
		this.lunchTime = "11:00 AM";
		this.supperTime = "4:00 PM";
		this.transportationTime = "7:00 PM";
		this.collectionLine.fetch();

	},

	render: function(){
		this.$el.html( this.template({model: this.model, title: this.title}) );
		this.$('#tableContainer').html( this.templateTable({header_fields: this.tableHeader}) );

		this.$form = this.$('#form-request');
		this.$formLine = this.$('#form-requestLine');
		this.ID = this.$('#requestID').html();
		this.populateRows();
		this.$form.validator();
		this.$('#date').datetimepicker({
			format: 'YYYY/MM/DD'
		});
		this.$('#hour').datetimepicker({
			format: 'LT'			
		});					
		return this;
	},

	populateRows: function(){
		var self = this;
		self.$('#rows').html('');


		if(self.ID){
			Promise.resolve(self.collectionLine.fetch()).then(function(response){
				while(!self.collectionLine.lines(self.ID)){ console.log('waiting') }
				var models = self.collectionLine.lines(self.ID);
				return models;
			}).then(function(rows){
				rows.forEach(function(elt,i,array){
					var viewR = new RequestLineView({model: elt, employees: self.employees});
					self.subViews.push(viewR);
					self.$('#rows').append( viewR.render().el );	
				});
			});
		}
	},

	addNewRow: function(row){
		var now = new Date(Date.now());
		var requestDateString = this.$('#date').val();
		var requestDate = new Date(requestDateString);
		var nowDate = now.getFullYear() + '/' +  (now.getMonth() > 10 ? now.getMonth() + 1 : '0'+(now.getMonth() + 1))
			  + '/' + (now.getDate() > 10 ? now.getDate(): '0' + now.getDate());
		var nowTime = now.getHours() % 12 + ':' + (now.getMinutes() < 10 ? ('0' + now.getMinutes()) : now.getMinutes())
			  + ' ' + (now.getHours() > 12 ? 'PM' : 'AM');

		var conditionalSupper = ($('#typeFeeding').val() == 'Cena') && (Date.parse('01/01/2016 ' + this.supperTime) > Date.parse('01/01/2016 ' + nowTime));
		var conditionalLunch = ($('#typeFeeding').val() == 'Almuerzo') && (Date.parse('01/01/2016 ' + this.lunchTime) > Date.parse('01/01/2016 ' + nowTime));
		if(requestDateString === nowDate){
			if(conditionalSupper || conditionalLunch){
				var view = new RequestLineView({employees: this.employees});
				this.$('#rows').append( view.render().el );
				this.verifyTransport();
			}else{
				this.$('#lineError')
					.html('No puedes ingresar solicitudes de Almuerzo despues de las 11:00 am ni solicitudes de Cena despues de la 4:00pm. Contactarse con RH')
					.show().hide(10000);
			}
		} else if (requestDate.getTime() > now.getTime()){
			var view = new RequestLineView({employees: this.employees});
			this.$('#rows').append( view.render().el );
			this.verifyTransport();
		}else{
			this.$('#lineError')
					.html('Revisa la fecha de solicitud. Pareciera que es antes que hoy.')
					.show().hide(10000);
		}				
	},

	verifyTransport: function(e){
		var time = $('#hour').val()
		var transportationCB = this.$('input[name=transportation]');
		if(transportationCB){
			if( (Date.parse('01/01/2016 ' + time) >= Date.parse('01/01/2016 ' + this.transportationTime))){
				transportationCB.each(function(i,elt){
					$(elt).prop('checked',true);
				});
			}else{
				transportationCB.each(function(i,elt){
					$(elt).prop('checked',false);
				});
			}
		}
	},

	confirmTransportation: function(e){
		if(window.localStorage.profile == 'hr' || window.localStorage.profile == 'sysadmin'){
			if(this.$('input[name="transportation"]').prop('checked') == true ){
				var val = $(e.currentTarget).prop('checked');
				$(e.currentTarget).prop('checked', val);
			}else{
				e.preventDefault();
				this.$('#lineError')
					.html('La hora de salida del empleado no aplica para transporte')
					.show().hide(8000);
			}
		}else{
			e.preventDefault();
			this.$('#lineError')
					.html('Solo Recursos Humanos puede confirmar el transporte')
					.show().hide(8000);
		}
		
	},

	getEmployeeId: function(key){
		var data = {};
		$('#emps option').each(function(i,el){
			data[$(el).val()] = $(el).data('value');
		});
		return data[key];
	},
	
	addRequest: function(e){
		e.preventDefault();
		this.$form.validator('validate');

		var formData = {},
			counter = 0,
			index = 0,
			formLineData = {},
			requestID = '',
			requestLineArray = [],
			invalid = false,
			feeding = [];

		this.$form.serializeArray().forEach(function(elt,i,array){
			formData[array[i].name] = array[i].value;
			if(!array[i].value){
				invalid = true;
			}
		});
		formData['requestLines'] = [];

		var self = this;
		$('tr td').children('input').each(function(i,elt){
			if( counter%4 == 0) {
				index = index + 1;
				formLineData[index] = {};

				//If updating Request then put the requestID to RequestLines
				if(this.ID) formLineData[index]['requestID'] = this.ID;

				feeding[index] = {};
				feeding[index]['feedingType'] = formData['feedingType'];
				feeding[index]['date'] = formData['date'];
				feeding[index]['approved'] = formData['approved']

				if($(elt).attr('id')){
					// Updating RequestLine
					formLineData[index]['id'] = $(elt).attr('id');
				}
			}

			if($(elt).attr('type') == 'checkbox'){
				formLineData[index][$(elt).attr('name')] = $(elt).is(':checked');
			}else{
				formLineData[index][$(elt).attr('name')] = $(elt).val();

				if($(elt).attr('name') == 'employeeID'){
					formLineData[index][$(elt).attr('name')] = self.getEmployeeId($(elt).val())
					feeding[index][$(elt).attr('name')] = $(elt).val();
				}
			}
			counter++
		});

		for(var key in formLineData){
			if( formLineData.hasOwnProperty(key) ){
				formData['requestLines'].push(formLineData[key]);
			}	
		}
		// console.log(formData);
		console.log(formLineData);
		if(!invalid){
			var self = this;
			// New Request
			if(!self.ID){
				self.collection.create(formData,{wait: true});
				// UpdateRequest
			}else{
				
				var modelRequest = self.collection.get(self.ID);
				modelRequest.save(formData);

				for(var key in formLineData){
					// Existing RequestLine
					if(formLineData[key]['id']){
						var modelLine = self.collectionLine.get(formLineData[key]['id']);
						Promise.resolve( modelLine.save(formLineData[key]) ).then(function(response){
							Promise.resolve(self.collectionLine.fetch());
						});
						// New Request Line
					}else{
						formLineData[key]['requestID'] = self.ID;
						Promise.resolve(self.collectionLine.create(formLineData[key])).then(function(response){
							self.collectionLine.fetch();
						})
					}
				}
			}
							
		};
		this.close();
	},

	onClose: function(){
		this.model.off('change',this.render);
		this.model.off('destroy',this.remove);
		console.log('unbinding');
	},

	close: function(){
		$('.modal').modal('hide');
		this.$el.detach();
		_.each(this.subViews, function(subView){
		 	subView.clean();
		 	if(subView.onClose){ subView.onClose() }
	    });
		this.unbind();
		this.remove();
	}
});

module.exports = RequestModalView;
