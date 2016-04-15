import React from 'react'
import ReactDOM from 'react-dom'
import datepicker from 'eonasdan-bootstrap-datetimepicker'
import moment from 'moment'

// Summary Row Component
class PaymentRow extends React.Component {
    render() {
        return( 
          <tr className='text-center'>
         	<td>{moment(this.props.feeding.get('date')).format('YYYY/MM/DD')}</td>
            <td>{this.props.feeding.get('employee').completeName}</td>
            <td>L. {this.props.feeding.get('price')}</td>
          </tr>
        )
    }
}

// Department Separator Component
class DepartmentRow extends React.Component {
	render(){
      return(
      	<tr>
      	  <th className='text-center subheader' colSpan={this.props.cols}>{this.props.department}</th>
      	</tr>
      )
	}
}

class TotalRow extends React.Component {
	render(){
		let countId = this.props.id ? (this.props.id + '-count') : '';
		return (
			<tr id={this.props.id} className='text-center divider' style={this.props.style || {}}>
			  <td colSpan="1"></td>
			  <td id={countId}>Total de platos: {this.props.count}</td>
			  <td>L. {this.props.sum}</td>
			</tr>
		)
	}
}

// Payment Table Component
class PaymentTable extends React.Component {
	filterDate(start,end,date){
		if(!start || !end ) return true
		return ((date >= start) && (date <= end))
	}

	render(){
		// Variables
		var rows = [],
			count = 0,
		    totalSum = 0,
		    sum = 0,
		    self = this,
		    key = 0,
			depts = this.props.departments,
			lastDepartment = null;
		// Iterating over sorted collection
		this.props.feedings.forEach(function(feeding){
			var date = Date.parse( moment(feeding.get('date')).format('YYYY/MM/DD') );
			var startDate = Date.parse(self.props.filterStartDate);
			var endDate = Date.parse(self.props.filterEndDate);
			// Filter by date
			if( !self.filterDate(startDate, endDate, date) ) return;
			// Check if it is a new department to append a new subheader row
			if(depts[feeding.get('employee').departmentId] !== lastDepartment){
				if(lastDepartment !== null) rows.push(<TotalRow id={'Total-' + lastDepartment.split(' ').join('')} key={key} count={count} sum={sum}/>)
				totalSum = totalSum + sum;
				count = 0;
				sum = 0;
				rows.push(
					<DepartmentRow cols={self.props.titles.length} department={depts[feeding.get('employee').departmentId]} key={feeding.get('employee').departmentId}/>
				);
			}
			[key, sum, count] = [key + 1, sum + parseFloat(feeding.get('price')), count + 1];
			rows.push( <PaymentRow feeding={feeding} key={feeding.get('id')}/>);
			lastDepartment = depts[feeding.get('employee').departmentId];
		});

		var id = 'AnyID';
		if(lastDepartment !== null){
			id = 'Total-' + lastDepartment.split(' ').join('');
		}
		//Append last department total
		rows.push(<TotalRow id={id} key={key} count={count} sum={sum}/>);
		totalSum = totalSum + sum;
		// Reset count
		count = 0;
		// Total Sum
		rows.push(<TotalRow style={{backgroundColor: '#FFC107'}} id={'Total'} key={key+1} count={key} sum={totalSum} />);
		return(
		  <table id='payment-table' className='table table-hover table-condensed'>
		    <thead>
		      <tr>
		  	   {this.props.titles}
		  	  </tr>
		    </thead>
		    <tbody>{rows}</tbody>
		  </table>
		) 
	}
}

// Filter Date Input Component
class SearchDate extends React.Component {
	constructor(props){
		super(props);
		this._bind('handleFilter');
	}

	componentDidMount(){
		$('#filterStartDate').datetimepicker({
			format: 'YYYY/MM/DD'
		});
		$('#filterEndDate').datetimepicker({
			format: 'YYYY/MM/DD'
		});
	}

	validateDates(start,end){ 
		if(Date.parse(start) > Date.parse(end)){
			toastr.error('La fecha final es mayor que la fecha de inicio.')
			return false;
		}else if( (!end && start) || (end && !start) ){
			toastr.error('No puedes dejar una fecha vacia');
			return false;
		}else{
			return true;
		}
	}

	handleFilter(){
		if( !this.validateDates(this.refs.filterStartDateInput.value, this.refs.filterEndDateInput.value) ) return;
		this.props.onFilter(
			this.refs.filterStartDateInput.value,
			this.refs.filterEndDateInput.value 
		)
	}

	render(){
		return (
		  <div className='form-inline'>
			  <div className='input-filter col-md-2 input-group date'>
			    <input id='filterStartDate' 
				    ref='filterStartDateInput' 
				    className='form-control' 
				    type='text' 
				    placeholder='Fecha de Inicio'/>
			  </div>
			  <div className='input-filter col-md-2 input-group date'>
			    <input id='filterEndDate' 
				    ref='filterEndDateInput' 
				    className='form-control' 
				    type='text' 
				    placeholder='Fecha Final'/>
			  	<span id='filter' className="input-group-addon" onClick={this.handleFilter}>
		          <a>
		            <span className="glyphicon glyphicon-filter"></span>
		          </a>
		        </span>
			  </div>
		  </div> 
		)
	}

	_bind(...methods){
	    methods.forEach((method) => this[method] = this[method].bind(this))
	}
}

// Print PDF
class ButtonPDF extends React.Component {
	constructor(props){
		super(props);
		this._bind('handleClick');
	}

	handleClick(){
		//Iterate over the table to get the totals
		let rows = [];
		$('table tr .subheader').each(function(i,elt){
			let dept = $(elt)[0].innerText
			let deptSelector = '#Total-' + dept.split(' ').join('');
			let deptChildren = $(deptSelector).children();
			let totalSum = deptChildren[deptChildren.length - 1].innerText
			let totalCountArr = $(deptSelector + '-count')[0].innerText.split(':');
			let totalDeptCount = totalCountArr[totalCountArr.length - 1]; 
			rows.push([dept, totalDeptCount, totalSum]); 
		})
		// Ge the total
		let totalCount = $('#Total-count')[0].innerText.split(':')
		rows.push(['TOTAL', totalCount[totalCount.length - 1], $('#Total').children()[2].innerText]);
		// Initialize jsPDF
		let doc = new jsPDF('p','pt');

		doc.setFontSize(22);
   	    doc.text("Pago", 40, 60);
   	    doc.setFontSize(12);
		doc.autoTable(this.props.columns,rows, {
			startY: 90,
			theme: 'grid'
		});
		doc.save('Resumen de Pagos a Cafeteria.pdf');
		/*
			columnStyles: {columnName: {columnWidth: 100}}
			styles: {overflow: 'hidden' | linebreak}
			bodyStyles: {style}
			margin: {horizontal: qty}
			pageBreak: 'avoid'
			theme: 'grid' | 'striped' | 'plain'
			drawHeaderRow: function() return false --> no 

		*/
	}

	render(){
		return (
			<div>
				<button ref='printPDF'  onClick={this.handleClick} type='button' className='btn btn-info'>PDF: Resumen</button>
			</div>
		)
	}

	_bind(...methods){
	    methods.forEach((method) => this[method] = this[method].bind(this))
	  }
}

// Payment Container Component
class PaymentContainer extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			filterStartDate: '',
			filterEndDate: ''
		};
		this._bind('handleFilter');
	}

	handleFilter(start,end){
		this.setState({
			filterStartDate: start,
			filterEndDate: end,
		})
	}

	componentWillMount(){
		var titles = [];
		this.props.columnTitles.forEach(function(title){
			titles.push(<th className='center' key={title}>{title}</th>);
		})
		this.titles = titles;
		this.columns = ['Departmento', 'Platos', 'Total'];
	}	

	render(){
		return(
		  <div>
		    <div className='center'>
		      <h2>Pago</h2>
		    </div>
		    <ButtonPDF columns={this.columns}/>
		    <SearchDate filterStartDate={this.state.filterStartDate}
		    			filterEndDate={this.state.filterEndDate} 
		    		    onFilter={this.handleFilter}/>
			<PaymentTable filterStartDate={this.state.filterStartDate}
						  filterEndDate={this.state.filterEndDate}
						  titles={this.titles} 
						  feedings={this.props.feedings} 
						  departments={this.props.departments}/>
	     </div>
		)
	}

	_bind(...methods){
	    methods.forEach((method) => this[method] = this[method].bind(this))
	}
}

export default PaymentContainer;
