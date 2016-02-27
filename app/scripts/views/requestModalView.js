var app = app || {};

(function(){
	app.RequestModalView = Backbone.View.extend({
		tagName:'div',
		className: 'modal-dialog',

		template: Handlebars.compile( $('#modal-template-request').html() ),

		templateTable: Handlebars.compile( $('#requestLine-table-template').html() ),

		events: {
			'click #save': 'addRequest',
			'click #feeding': 'enableFeedingType',
			'click #add' : 'addNewRow'
		},

		tableHeader:[
			{name: 'Empleado'},
			{name: 'Jornada'},
			{name: '<i class="fa fa-beer"></i>',tooltip: 'Alimentacion'},
			{name:'<i class="fa fa-check-circle"></i>' ,tooltip: 'Aprobar'},
			{name: '<i class="fa fa-bus"></i>',tooltip: 'Transporte'},
			{name: '<i class="fa fa-thumbs-o-up"></i>',tooltip: 'Confirmar Transporte'}
		],

		render: function(){
			app.Employees.fetch();
			console.log(this.model);
			this.$el.html( this.template({model: this.model}));
			this.$('#tableContainer').html( this.templateTable({header_fields: this.tableHeader}) )

			this.$form = this.$('#form-request');
			this.$formLine = this.$('#form-requestLine');
			this.enableFeedingType();
			this.$form.validator();
			this.$('#date').datetimepicker({
				format: 'YYYY/MM/DD'
			});
			this.$('#hour').datetimepicker({
				format: 'LT'			
			});					
			return this;
		},

		enableFeedingType: function(){
			if( !this.$('#feeding').is(':checked') ){
				
				this.$('#feedingTypeGroup').addClass('hide');
			}else{
				
				this.$('#feedingTypeGroup').removeClass('hide');
			}
		},

		addNewRow: function(){
			var view = new app.RequestLineView();
			this.$('#rows').append( view.render().el );			
		},

		addRequest: function(e){
			e.preventDefault();
			this.$form.validator('validate');
			var invalid = false;

			var formData = {},
				counter = 0,
				index = 0,
				formLineData = {},
				requestID = '',
				requestLineArray = [];

			this.$form.serializeArray().forEach(function(elt,i,array){
				formData[array[i].name] = array[i].value;
				if(!array[i].value){
					invalid = true;
				}
			});

			$('tr td').children('input').each(function(i,elt){
				if( counter%6 == 0) {
					index = index + 1;
					formLineData[index] = {};
				}
				if($(elt).attr('type') == 'checkbox'){
					formLineData[index][$(elt).attr('name')] = $(elt).is(':checked');
				}else{
					formLineData[index][$(elt).attr('name')] = $(elt).val();
				}
				counter++
			});
			
			if(!invalid){
				Promise.resolve(this.collection.create(formData)).then(function(response){
					requestID = response.collection.models[0].attributes.id;
					for(var key in formLineData){
						if(formLineData.hasOwnProperty(key)){
							formLineData[key]['requestID'] = requestID;
							app.RequestLines.create(formLineData[key]);
						}
					}
				})
			};
			//this.close();
		},

		close: function(){
			$('.modal').modal('hide');
			this.$el.detach();
			this.render();
		}
	});
}())