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

console.log(calculateEndDate(42,5,new Date()));