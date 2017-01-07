// Add Leading zero to PPD
var ppd = document.querySelector('.app-ppd_input'),
		generate = document.querySelector('#chartGenerate'),
		add = document.querySelector('#chartAdd'),
		chart = document.querySelector('#chartRows'),
		chartRow = document.querySelector('#chartRowTemplate');

ppd.addEventListener('change', function(e) {
	var ppdVal = e.target.value;
	if (ppdVal < 10) {
		e.target.value = ('0' + ppdVal).slice(-2);
	}
});

var dotw = ['Su','Mo','Tu','We','Th','Fr','Sa'];

// (int, int, Date) => FormattedDate 
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

chart.addEventListener('click', function(e) {
	if (e.target.classList.contains('app-chart-remove')) {
		e.target.parentNode.parentNode.remove();
	}
	return false;
});

add.addEventListener('click', function(e) {
	var clone = document.importNode(chartRow.content.children[0], true);
	chart.appendChild(clone);
});