import React from 'react';
import ReactDOM from 'react-dom';

const DATA = [ 5, new Date(), [15,12,18] ];

function zeroPadSmallerThanTen(val) {
  if (val < 10) { return ('0'+val); }
  return val;
}

class BookProgressChartGenerator extends React.Component {
 render() {
   return (
    <div>
      <PagesPerDayField ppd={this.props.data[0]} />
      <ProgressChart lastDate={this.props.data[1]} chapterPages={this.props.data[2]} />
    </div>
   );
 }
}

class PagesPerDayField extends React.Component {
  render() {
    let ppdVal = zeroPadSmallerThanTen(this.props.ppd);
    return (
			<section className="app-ppd_wrapper">
				<input className="app-ppd_input" value={ppdVal} name="ppd" type="number" step="1" min="1" />
				<label className="app-ppd_label" for="ppd" title="Pages per Day">P/D</label> 
				<p className="app-ppd_helper">Enter number of pages read per day</p>
			</section>
    );
  }
}
class ProgressChart extends React.Component {
  render() {
    let chartRows = [];

    for (let i = 0; i < this.props.chapterPages.length; i++) {
      if (i === 0) {
        chartRows.push(<FirstChapterRow pages={this.props.chapterPages[i]} />);
        continue;
      }
      chartRows.push(<AddedChapterRow pages={this.props.chapterPages[i]} />);
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
class FirstChapterRow extends React.Component {
  render() {
    let pageCount = zeroPadSmallerThanTen(this.props.pages);
    return (
	  	<tr>
				<td><span className="app-chart_chapNum"></span></td>
	  		<td className=""><input className="app_chart_field pagesInChapter" value={pageCount} type="number" max="999" min="1" /></td>
				<td className="null"></td>
				<td className="null"></td>
				<td className="null app-chart-projected"></td>
				<td className="null"></td>
				<td className="null large"></td>
				<td className="null large"></td>
			</tr>  
    );
  }
}
class AddedChapterRow extends React.Component {
  render() {
    let pageCount = zeroPadSmallerThanTen(this.props.pages);
    return (
		  <tr>
				<td><span className="app-chart_chapNum"></span></td>
				<td className=""><input className="app_chart_field pagesInChapter" value={pageCount} type="number" max="999" min="1" /></td>
				<td className="null"></td>
				<td className="null"></td>
				<td className="null app-chart-projected"></td>
				<td className="null"></td>
				<td className="null large"></td>
				<td className="null large">
				  <a className="app-chart-remove" href="javascript:void(0);" tabindex="-1">-</a>
        </td>
			</tr>
    );
  }
}
class Toolbar extends React.Component {
  render() {
    return (
      <div>
			  <a className="app-chart-button generate" id="chartGenerate" href="javascript:void(0);">Generate</a>
			  <a className="app-chart-button add" id="chartAdd" href="javascript:void(0);">Add Row</a>
			  <p className="app-chart-error"></p>
      </div>
    );
  }
}

ReactDOM.render(
  <BookProgressChartGenerator data={DATA} />,
  document.getElementById('root')
);
