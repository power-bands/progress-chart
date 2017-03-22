import React from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid';

const dotw = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function zeroPadInteger(val, hasThreeDigits) {
  if (hasThreeDigits || parseInt(val,10) > 99) { return ("00"+val).substr(-3); }
  return ("0"+val).substr(-2);
}

class BookProgressChartGenerator extends React.Component {
  constructor(props) {
    super(props);
    
    // Bind Handlers (allow to be passed as props)
    this.handlePPD = this.handlePPD.bind(this);
    this.handleChapterPages = this.handleChapterPages.bind(this);
    this.handleGenerateProjected = this.handleGenerateProjected.bind(this);
    this.handleAddRow = this.handleAddRow.bind(this);
    this.handleRemoveRow = this.handleRemoveRow.bind(this);
    this.setProjectedRows = this.setProjectedRows.bind(this);

    let initRows = {};
    initRows['ch_'+uuid()] = {
      pages: 0,
      d: new Date(),
      month: new Date().getMonth() + 1,
      date: new Date().getDate(),
      day: dotw[new Date().getDay()],
      isFirst: true
    };

    this.state = {
      ppd: {
        val: 0,
        hasError: false
      },
      rows: initRows,
      errorMessage: ''
    };
  }

  handlePPD(e) { 
    let ppd = { ...this.state.ppd },
        val = (e.target.value) ? Math.min(parseInt(e.target.value,10),99) : 0;

    ppd.val = val;
    this.setState( {ppd} );
  }
  handleChapterPages(e,uuid) {
    let pages = (e.target.value) ? Math.min(parseInt(e.target.value,10),999) : 0,
        rows = { ...this.state.rows };

    rows[uuid].pages = pages;
    this.setState( {rows} );
  }
  handleAddRow(e) {
    let rows = { ...this.state.rows };

    rows['ch_'+uuid()] = {
      pages: 0,
      d: new Date(),
      month: new Date().getMonth() + 1,
      date: new Date().getDate(),
      day: dotw[new Date().getDay()],
      hasError: false,
      isFirst: false
    };

    this.setState( {rows} );
  }
  handleRemoveRow(e,uuid) {
    let rows = { ...this.state.rows };

    delete rows[uuid];

    this.setState( {rows} );
  }

  setProjectedRows(row,d) {
    let pgs = row.pages,
        end = d,
        ppd = this.state.ppd.val,
        duration = Math.ceil(pgs/ppd);

    console.log(pgs,end,ppd);
    end.setDate(end.getDate() + duration);

    return {
      pages: row.pages,
      d: end,
      month: end.getMonth() + 1,
      date: end.getDate(),
      day: dotw[end.getDay()],
      projected: (end.getMonth() + 1) + '/' + (end.getDate()),
      hasError: false,
      isFirst: row.isFirst
    };
  }

  handleGenerateProjected(e) {
    let rows = { ...this.state.rows },
        rowKeys = Object.keys(rows),
        rowKeysLength = rowKeys.length,
        rollingDate = new Date(),
        ppd = { ...this.state.ppd };

    this.setErrorMessage('');

    for (let i = 0; i < rowKeysLength; i++) {
      
      if (this.state.ppd.val === 0) {
        ppd.hasError = true;
        this.setState( {ppd} );
        this.setErrorMessage('Missing Pages Per Day');
        return;
      }
      
      if (rows[rowKeys[i]].pages === 0) {
        rows[rowKeys[i]].hasError = true;
        rows[rowKeys[i]].projected = '';
        this.setErrorMessage('Missing Chapter Pages');
        continue;
      }
      
      rows[rowKeys[i]] = this.setProjectedRows(rows[rowKeys[i]],rollingDate);
      rollingDate = rows[rowKeys[i]].d;

    }

    if (ppd.hasError) {
      ppd.hasError = false;
      this.setState( {ppd} );
    }
    
    this.setState( {rows} );
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  setErrorMessage(msg) {
    this.setState ({errorMessage: msg});
  }

  render() {
   return (
    <div>
      <PagesPerDayField 
        ppd={this.state.ppd.val} 
        hasError={this.state.ppd.hasError}
        handlePPD={this.handlePPD} />
      <ProgressChart 
        rows={this.state.rows}
        ppd={this.state.ppd}
        handleChapterPages={this.handleChapterPages}
        handleGenerateProjected={this.handleGenerateProjected}
        handleRemoveRow={this.handleRemoveRow}
        handleAddRow={this.handleAddRow}
        errorMessage={this.state.errorMessage} />
    </div>
   );
  }
}

class PagesPerDayField extends React.Component {
  render() {

    let inputModifier = (this.props.hasError) ? "app-ppd_input error" : "app-ppd_input";

    return (
			<section className="app-ppd_wrapper">
				<input className={inputModifier}
               value={zeroPadInteger(this.props.ppd,false)}
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
        rowKeys = Object.keys(this.props.rows),
        rowKeysLength = rowKeys.length;

      for (let i = 0; i < rowKeysLength; i++) {
        chartRows.push(
          <ChapterRow isFirst={this.props.rows[rowKeys[i]].isFirst} 
                      key={rowKeys[i]} 
                      chapterUUID={rowKeys[i]} 
                      hasError={this.props.rows[rowKeys[i]].hasError}
                      pages={this.props.rows[rowKeys[i]].pages}
                      projected={this.props.rows[rowKeys[i]].projected}
                      handleChapterPages={this.props.handleChapterPages}
                      handleRemoveRow={this.props.handleRemoveRow} />
        );
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
        <Toolbar handleGenerateProjected={this.props.handleGenerateProjected} 
                 handleAddRow={this.props.handleAddRow}
                 errorMessage={this.props.errorMessage}/>
      </section>    
    );
  }
}

class ChapterRow extends React.Component {
  render() {
    let projectedModifier = (this.props.projected) ? 'app-chart-projected' : 'app-chart-projected null',
        rowRemove = (this.props.isFirst) ? null : <a className="app-chart-remove" onClick={(e) => this.props.handleRemoveRow(e,this.props.chapterUUID)} tabIndex="-1">-</a>,
        inputModifier = (this.props.hasError) ? "app_chart_field pagesInChapter error" : "app_chart_field pagesInChapter";
    return (
		  <tr>
				<td><span className="app-chart_chapNum"></span></td>
				<td className="">
          <input className={inputModifier}
                 value={zeroPadInteger(this.props.pages,true)}
                 onChange={(e) => this.props.handleChapterPages(e,this.props.chapterUUID)}
                 type="number"
                 max="999"
                 min="1" />
          </td>
				<td className="null"></td>
				<td className="null"></td>
				<td className={projectedModifier}>{this.props.projected}</td>
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

    let errorMessageModifier = (this.props.errorMessage) ? 'app-chart-error visible' : 'app-chart-error';

    return (
      <div>
			  <a className="app-chart-button generate"
           id="chartGenerate"
           onClick={this.props.handleGenerateProjected}>Generate</a>
			  <a className="app-chart-button add"
           id="chartAdd"
           onClick={this.props.handleAddRow}>Add Row</a>
			  <p className={errorMessageModifier}>{this.props.errorMessage}</p>
      </div>
    );
  }
}

ReactDOM.render(
  <BookProgressChartGenerator  />,
  document.getElementById('root')
);
