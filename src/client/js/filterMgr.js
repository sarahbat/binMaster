// filterManager - simplified filtering of data using the dataMgr
// filters all rows based on specified attribute

var fm = {};

fm.removeNull = function(attribute, nullVal){
	matchFn = function(r){return r[attribute] !== nullVal;}
	// console.log(binMaster.dataMgr.getRows().length);
	// console.log(binMaster.dataMgr.getRows(matchFn).length);
	return binMaster.dataMgr.getRows(matchFn);
};

fm.isNull = function(attribute, nullVal){
	matchFn = function(r){return r[attribute] === nullVal;}
	return binMaster.dataMgr.getRows(matchFn);
};

fm.inRange = function(attribute, minVal, maxVal){
	matchFn = function(r){
		return (r[attribute] >= minVal && r[attribute] <= maxVal);
	}
	return binMaster.dataMgr.getRows(matchFn);
};

fm.lessThan = function(attribute, maxVal){
	matchFn = function(r){
		return r[attribute] < maxVal;
	}
	return binMaster.dataMgr.getRows(matchFn);
};

fm.moreThan = function(attribute, minVal){
	matchFn = function(r){
		return r[attribute] > minVal;
	}
	return binMaster.dataMgr.getRows(matchFn);
}; 

fm.equalTo = function(attribute, val){
	matchFn = function(r){
		return r[attribute] === val;
	}
	return binMaster.dataMgr.getRows(matchFn);
}

fm.oneColumn = function(attribute){
	return binMaster.dataMgr.getColumn(attribute);
};
