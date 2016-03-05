var app = app || {};

(function(){
	app.RequestModalView = Backbone.View.extend({
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
			{name: '<i class="fa fa-beer"></i>',tooltip: 'Alimentacion'},
			{name:'<i class="fa fa-check-circle"></i>' ,tooltip: 'Aprobar'},
			{name: '<i class="fa fa-bus"></i>',tooltip: 'Transporte'},
			{name: '<i class="fa fa-thumbs-o-up"></i>',tooltip: 'Confirmar Transporte'}
		],

		initialize: function(){
			this.collection = app.Requests;
			this.collectionLine = app.RequestLines;
			this.collectionFeeding = app.Feedings;
			this.subViews = []
			this.lunchTime = "11:00 AM";
			this.supperTime = "4:00 PM";
			this.transportationTime = "7:00 PM";

			this.collectionLine.fetch();
		},

		render: function(){
			app.Employees.fetch();
			this.$el.html( this.template({model: this.model, title: this.title}) );
			this.$('#tableContainer').html( this.templateTable({header_fields: this.tableHeader}) )

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
						var viewR = new app.RequestLineView({model: elt });
						self.subViews.push(viewR);
						self.$('#rows').append( viewR.render().el );	
					});
				});
			}
		},

		addNewRow: function(row){
			var now = new Date(Date.now());
			var nowTime = now.getHours() % 12 + ':' + (now.getMinutes() < 10 ? ('0' + now.getMinutes()) : now.getMinutes())
				  + ' ' + (now.getHours() > 12 ? 'PM' : 'AM');

			var conditionalSupper = ($('#typeFeeding').val() == 'Cena') && (Date.parse('01/01/2016 ' + this.supperTime) > Date.parse('01/01/2016 ' + nowTime));
			var conditionalLunch = ($('#typeFeeding').val() == 'Almuerzo') && (Date.parse('01/01/2016 ' + this.lunchTime) > Date.parse('01/01/2016 ' + nowTime));
			if( conditionalSupper || conditionalLunch || true){
				var view = new app.RequestLineView();
				this.$('#rows').append( view.render().el );
				this.verifyTransport();
			} else{
				this.$('#lineError')
					.html('No puedes ingresar solicitudes de Almuerzo despues de las 11:00 am ni solicitudes de Cena despues de la 4:00pm. Contactarse con RH')
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
			if(this.$('input[name="transportation"]').prop('checked') == true ){
				$(e.currentTarget).prop('checked',true);
			}else{
				e.preventDefault();
				this.$('#lineError')
					.html('La hora de salida del empleado no aplica para transporte')
					.show().hide(5000);
			}
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

			$('tr td').children('input').each(function(i,elt){
				if( counter%5 == 0) {
					index = index + 1;
					formLineData[index] = {};

					feeding[index] = {};
					feeding[index]['feedingType'] = formData['feedingType'];
					feeding[index]['date'] = formData['date'];
					//update
					if($(elt).attr('id')){
						formLineData[index]['id'] = $(elt).attr('id');
					}
				}
				if($(elt).attr('type') == 'checkbox'){
					formLineData[index][$(elt).attr('name')] = $(elt).is(':checked');
				}else{
					formLineData[index][$(elt).attr('name')] = $(elt).val();
					if($(elt).attr('name') == 'employeeID'){
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
			console.log(formData);
			// console.log(formLineData);
			if(!invalid){
				var self = this;
				if(!self.ID){
					self.collection.create(formData,{
						wait: true,
						success: function(response){
							for(var key in formLineData){
								formLineData[key]['requestID'] = response.id;
								feeding[key]['requestID'] = response.id
								// app.RequestLines.create(formLineData[key]);
								self.collectionFeeding.create(feeding[key]);
							}
						}
					});
					console.log('later');
				}else{
					var modelRequest = self.collection.get(self.ID);
					modelRequest.save(formData);

					for(var key in formLineData){
						if(formLineData[key]['id']){
							var modelLine = self.collectionLine.get(formLineData[key]['id']);
							Promise.resolve( modelLine.save(formLineData[key]) ).then(function(response){
								Promise.resolve(self.collectionLine.fetch());
							});
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
}())