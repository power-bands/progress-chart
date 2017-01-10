(function() {

var ppd = document.querySelector('.app-ppd_input'),
		generate = document.querySelector('#chartGenerate'),
		add = document.querySelector('#chartAdd'),
		chart = document.querySelector('#chartRows'),
		error = document.querySelector('.app-chart-error'),
		chartRow = document.querySelector('#chartRowTemplate'),
		dotw = ['Su','Mo','Tu','We','Th','Fr','Sa'],
		errorInterval = null;

ppd.addEventListener('change', function resetPPD(e) {

	e.target.classList.remove('error');
	var ppdVal = e.target.value;

	if (ppdVal < 10) {
		e.target.value = ('0' + ppdVal).slice(-2);
	}

});

chart.addEventListener('focusin', function removeErrorState(e) {
	if (e.target.tagName == 'INPUT') {
		e.target.classList.remove('error');
	}
	return false;
});

chart.addEventListener('click', function removeRow(e) {
	if (e.target.classList.contains('app-chart-remove')) {
		e.target.parentNode.parentNode.remove();
	}
	return false;
});

chart.addEventListener('change', function padChapterNumber(e) {
	if (e.target.tagName == 'INPUT') {
		var chapterPageCount = e.target.value;
		if (chapterPageCount < 10) {
			e.target.value = ('0' + chapterPageCount).slice(-2);
		}
	}
	return false;
});



add.addEventListener('click', function addRow(e) {
	var clone = document.importNode(chartRow.content.children[0], true);
	chart.appendChild(clone);
});

generate.addEventListener('click', function generateChart(e) {

	var projectedDOM 		= [].slice.call(document.querySelectorAll('.app-chart-projected'),0),
			pagesInChapter 	= [].slice.call(document.querySelectorAll('.pagesInChapter'),0),
			projectedLEN 		= projectedDOM.length,
			rollingDate 		= new Date(),
			pagesPerDay 		= ppd.value,
			errorFields			= [];

	if (pagesPerDay <= 0) {
		errorInterval = showError('Provide Pages Read Per Day', [ppd], errorInterval);
		
		return false;
	}

	for (var i = 0; i < projectedLEN; i++) {

		if (pagesInChapter[i].value.length == 0) {
			errorFields.push(pagesInChapter[i]);
			continue;
		}

		var projectedDate = calculateEndDate(pagesInChapter[i].value, pagesPerDay, rollingDate);
		
		projectedDOM[i].style.color = '#fff';
		projectedDOM[i].classList.remove('null');
		projectedDOM[i].innerText = projectedDate.month + '/' + projectedDate.date;

		rollingDate = projectedDate.d;
	}

	if (errorFields.length > 0) {
		errorInterval = showError('Missing Chapter Page Count', errorFields, errorInterval);
		return false;
	}

});

// (str,Array<DOM,Interval) => FormattedDate 
function showError(msg,fields,interval) {

	error.innerText = msg;
	error.classList.add('visible');

	clearInterval(interval);

	var errorInterval = setTimeout(function() {
		error.classList.remove('visible');
	}, 7000);

	fields.map(function(i) {
		i.classList.add('error');
	});

	return errorInterval;

}

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