(function() {

// Add Leading zero to PPD
var ppd = document.querySelector('.app-ppd_input'),
		generate = document.querySelector('#chartGenerate'),
		add = document.querySelector('#chartAdd'),
		chart = document.querySelector('#chartRows'),
		chartRow = document.querySelector('#chartRowTemplate');

var dotw = ['Su','Mo','Tu','We','Th','Fr','Sa'];

ppd.addEventListener('change', function(e) {
	var ppdVal = e.target.value;
	if (ppdVal < 10) {
		e.target.value = ('0' + ppdVal).slice(-2);
	}
});

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

generate.addEventListener('click', function(e) {
	var projectedDOM = [].slice.call(document.querySelectorAll('.app-chart-projected'),0),
			pagesInChapter = [].slice.call(document.querySelectorAll('.pagesInChapter'),0),
			projectedLEN = projectedDOM.length,
			rollingDate = new Date(),
			pagesPerDay = ppd.value;

	for (var i = 0; i < projectedLEN; i++) {
		var projectedDate = calculateEndDate(pagesInChapter[i].value, pagesPerDay, rollingDate);

		// projectedDOM[i].style.color = 'rgba(15,14,18,1)';
		// projectedDOM[i].style.transitionDelay = (i * 140) + 'ms';
		
		projectedDOM[i].style.color = '#fff';
		projectedDOM[i].classList.remove('null');
		projectedDOM[i].innerText = projectedDate.date+'/'+projectedDate.month;

		// setTimeout(function() { projectedDOM[i].style.color = '#fff'; }, 100);

		rollingDate = projectedDate.d;
	}

});

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

})();