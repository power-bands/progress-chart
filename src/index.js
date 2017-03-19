import React from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid';

const DATA = [ 5, [15,12,18] ];
const dotw = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function zeroPadInteger(val) {
  if (parseInt(val,10) > 99) { return ("0"+val).substr(-3); }
  return ("0"+val).substr(-2);
}

function calculateEndDate(pgs, ppd, end) {
  var duration = Math.ceil(pgs/ppd);
  end.setDate(end.getDate() + duration);
  return {
    d: end,
    month: end.getMonth() + 1,
    date: end.getDate(),
    day: dotw[end.getDay()]
  };
}

class BookProgressChartGenerator extends React.Component {
  constructor(props) {
    super(props);
    
    // Bind Handlers (allow to be passed as props)
    this.handlePPD = this.handlePPD.bind(this);
    this.handleChapterPages = this.handleChapterPages.bind(this);
    this.handleGenerateProjected = this.handleGenerateProjected.bind(this);
    this.handleAddRow = this.handleAddRow.bind(this);

    this.state = {ppd: 0, chapters: []};
  }

  handlePPD(e) { 
    let ppdAsInt = (parseInt(e.target.value,10) > 99) ? 99 : parseInt(e.target.value,10);
    if (ppdAsInt > 99) return;
    this.setState( {ppd: ppdAsInt} );
  }
  handleChapterPages(e) { this.setState(); }
  handleGenerateProjected(e) { this.setState(); }
  handleAddRow(e) { this.setState(); }

  componentDidUpdate() {
    console.log(this.state);
  }

  render() {
   return (
    <div>
      <PagesPerDayField 
        ppd={this.state.ppd} 
        handlePPD={this.handlePPD} />
      <ProgressChart 
        chapterPages={this.props.data[1]}
        ppd={this.state.ppd}
        handleChapterPages={this.handleChapterPages}
        handleGenerateProjected={this.handleGenerateProjected}
        handleAddRow={this.handleAddRow} />
    </div>
   );
  }
}

class PagesPerDayField extends React.Component {
  render() {
    return (
			<section className="app-ppd_wrapper">
				<input className="app-ppd_input"
               value={zeroPadInteger( this.props.ppd )}
               name="ppd"
               type="number"
               step="1"
               min="1"
               max="99"
               onChange={this.props.handlePPD} />
				<label className="app-ppd_label" htmlFor="ppd" title="Pages per Day">P/D</label> 
				<p className="app-ppd_helper">Enter number of pages read per day</p>
			</section>
    );
  }
}

class ProgressChart extends React.Component {
  render() {

    let chartRows = [],
        rollingDate = new Date(); 

    for (let i = 0; i < this.props.chapterPages.length; i++) {

      let lastDate = calculateEndDate(this.props.chapterPages[i],this.props.ppd,rollingDate),
          projectedDate = lastDate.month + '/' + lastDate.date;

      chartRows.push(<ChapterRow isFirst={i === 0} key={'ch_'+uuid()} pages={this.props.chapterPages[i]} projected={projectedDate} />);
      rollingDate = lastDate.d;

    } 

    return (
			<section className="app-chart_wrapper cf">
				<table className="app-chart_table">
					<thead>
						<tr>
							<th>#</th>
							<th>No</th>
							<th>S</th>
							<th>F</th>
							<th>P</th>
							<th>D</th>
							<th className="large">T</th>
							<th className="large">V</th>
						</tr>
					</thead>
					<tbody id="chartRows">{chartRows}</tbody>
        </table>
        <Toolbar />
      </section>    
    );
  }
}

class ChapterRow extends React.Component {
  render() {
    let pageCount = zeroPadInteger(this.props.pages),
        rowRemove = (this.props.isFirst) ? null : <a className="app-chart-remove" href="#0" tabIndex="-1">-</a>;
    return (
		  <tr>
				<td><span className="app-chart_chapNum"></span></td>
				<td className=""><input className="app_chart_field pagesInChapter" defaultValue={pageCount} type="number" max="999" min="1" /></td>
				<td className="null"></td>
				<td className="null"></td>
				<td className="app-chart-projected">{this.props.projected}</td>
				<td className="null"></td>
				<td className="null large"></td>
				<td className="null large">
				  {rowRemove}
        </td>
			</tr>
    );
  }
}

class Toolbar extends React.Component {
  render() {
    return (
      <div>
			  <a className="app-chart-button generate" id="chartGenerate" href="#0">Generate</a>
			  <a className="app-chart-button add" id="chartAdd" href="#0">Add Row</a>
			  <p className="app-chart-error"></p>
      </div>
    );
  }
}

ReactDOM.render(
  <BookProgressChartGenerator data={DATA} />,
  document.getElementById('root')
);
