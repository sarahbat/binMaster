// filterManager - simplified filtering of data using the dataMgr
// filters all rows based on specified attribute

var fm = {};

fm.greaterThan = function(attribute, val, obj){
	matchFn = function(r){return r[attribute] > val;}

	var rows = obj === undefined ? binMaster.dataMgr.getRows(matchFn) : binMaster.dataMgr.getRows(matchFn, obj);
	return rows;
}

fm.greaterThan_equal = function(attribute, val, obj){
	matchFn = function(r){return r[attribute] >= val;}

	var rows = obj === undefined ? binMaster.dataMgr.getRows(matchFn) : binMaster.dataMgr.getRows(matchFn, obj);
	return rows;
}

fm.lessThan = function(attribute, val, obj){
	matchFn = function(r){return r[attribute] < val;}

	var rows = obj === undefined ? binMaster.dataMgr.getRows(matchFn) : binMaster.dataMgr.getRows(matchFn, obj);
	return rows;
}

fm.lessThan_equal = function(attribute, val, obj){
	matchFn = function(r){return r[attribute] <= val;}

	var rows = obj === undefined ? binMaster.dataMgr.getRows(matchFn) : binMaster.dataMgr.getRows(matchFn, obj);
	return rows;
}

fm.equalTo = function(attribute, val, obj){
	matchFn = function(r){return r[attribute] === val;}

	var rows = obj === undefined ? binMaster.dataMgr.getRows(matchFn) : binMaster.dataMgr.getRows(matchFn, obj);
	return rows;
}

fm.equalTo_list = function(attribute, vals, obj){
	matchFn = function(r){
		if (vals.includes(r[attribute])){
			return r[attribute]
		}
	}

	var rows = obj === undefined ? binMaster.dataMgr.getRows(matchFn) : binMaster.dataMgr.getRows(matchFn, obj);
	return rows;
}

fm.between = function(attribute, minVal, maxVal, obj){
	matchFn = function(r){
		if (r[attribute] > minVal && r[attribute] < maxVal){return r[attribute]}
	}

	var rows = obj === undefined ? binMaster.dataMgr.getRows(matchFn) : binMaster.dataMgr.getRows(matchFn, obj);
	return rows;
}

fm.between_equal = function(attribute, minVal, maxVal, obj){
	matchFn = function(r){
		if (r[attribute] >= minVal && r[attribute] <= maxVal){return r[attribute]}
	}

	var rows = obj === undefined ? binMaster.dataMgr.getRows(matchFn) : binMaster.dataMgr.getRows(matchFn, obj);
	return rows;
}



fm.removeRowsByAttribute = function(attribute, nullVal, obj){
	matchFn = function(r){return r[attribute] !== nullVal;}

	var rows = obj === undefined ? binMaster.dataMgr.getRows(matchFn) : binMaster.dataMgr.getRows(matchFn, obj);
	return rows;
};

fm.removeNull_column = function(attribute, nullVal, obj){
	matchFn = function(r){return r[attribute] !== nullVal;}

	var rows = obj === undefined ? binMaster.dataMgr.getRows(matchFn) : binMaster.dataMgr.getRows(matchFn, obj);
	var col = [];
	for (var i = 0; i < rows.length; i++){
		col.push(rows[i][attribute]);
	}
	return col;
};

fm.getColumn = function(attribute, obj){
	var col = [];
	for (var i = 0; i < obj.length; i++){
		col.push(obj[i][attribute]);
	}
	return col;
}


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


