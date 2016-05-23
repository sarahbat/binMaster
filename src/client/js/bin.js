/**
 * @fileoverview bin.js defines the Bin object.  A Bin consists of:
 * 				- numeric definition of bin extrema (min/max)
 *				- encoding definition
 * 				- label definition(s) with numeric and semantic definition of the bin class and extrema
 */
/*jslint nomen:true, plusplus:true, todo:true,  browser:true  */
"use strict";

// TODO: Fill in getters / setters

const DEFAULT_COLOR = '#ccc';
const DEFAULT_NULL_COLOR = '#ddd';

/**
 * @param {number} opt_minVal - minimum bin value
 * @param {number} opt_maxVal - maximum bin value
 * @param {string} opt_color - color for the bin (in hex)
 *  
 * @constructor
 */
binMaster.Bin = function (opt_minVal, opt_maxVal, opt_colorVal) {
	this.setNumericDefn(opt_minVal, opt_maxVal);
	this.setEncodingDefn(opt_colorVal); 
	this.labelVals = {}; // default object for label values
	this.setLabelDefn("DEFAULT", opt_minVal, opt_maxVal); // always create a default label based on any specified min/max values
};

/**
 * Numeric characteristics for one bin;
 * calculates range if both min and max are defined
 * 
 * @param {number} opt_minVal - an optional minimum value for the bin
 * @param {number} opt_maxVal - an optional maximum value for the bin 
 */ 
binMaster.Bin.prototype.setNumericDefn = function(opt_minVal, opt_maxVal){
	this.binVals = {
		min: opt_minVal === undefined ? 0 : opt_minVal, 
		max: opt_maxVal === undefined ? 0 : opt_maxVal, 
		range: opt_maxVal-opt_minVal
	};

	// if a DEFAULT labelDefn already exists, update it with new numeric definition (pass a null for Range; will be set in set_labelDefn)
	if (this.labelVals){
		this.setLabelDefn("DEFAULT", 
							null, 
							this.binVals.min === undefined ? 0 : this.binVals.min, 
							this.binVals.max === undefined ? 0 : this.binVals.max);
	} 
};

/**
 * Encoding for one Bin
 * currently only supports color encoding
 * 
 * @param {string} opt_colorVal - an optional color encoding for the bin.  Takes most color formats; uses chroma.js
 */ 
binMaster.Bin.prototype.setEncodingDefn = function(opt_colorVal){
	// could be extended to have different encoding objects for different purposes
	// could also be extended to have additional encoding options; currently just supports color
	this.setColor(opt_colorVal);
}

/**
 * Numeric or semantic  encoding characteristics for labeling bin.  
 * DEFAULT is set up when class is created, will always contain numeric entries
 * 
 * @param {string} labelName - label for bin entry
 * @param {string} rangeVal - range-based label for class (DEFAULT labelName = "minVal - maxVal")
 * @param {string} minVal - label for min edge of class (DEFAULT labelName = minVal)
 * @param {string} maxVal - label for max edge of class (DEFAULT labelName = maxVal)
 */
binMaster.Bin.prototype.setLabelDefn = function(labelName, rangeVal, minVal, maxVal){
	if (labelName === "DEFAULT"){ // if this is the initialization, set the min/max to the object min/max (if they were already defined)
		// console.log('Setting label definition for DEFAULT labels - any min, max, or range parameters are ignored.  DEFAULT labels are only based on numeric definition.')
		this.setLabelMin(this.binVals.min === undefined ? 0: this.binVals.min, 'DEFAULT');
		this.setLabelMax(this.binVals.max === undefined ? 0: this.binVals.max, 'DEFAULT');
		this.setLabelRange(this.binVals.min + ' - ' + this.binVals.max, 'DEFAULT');
		return;
	}

	this.labelVals[labelName] = {
		rangeLabel: rangeVal, 
		minLabel: minVal,  
		maxLabel: maxVal 
	};

	// if (rangeVal === undefined || rangeVal === null){
	// 	rangeVal = minVal + " - " + maxVal;  // label for class - if not specified, default to "binVals.min - binVals.max"
	// }


	// 	if (minVal !== undefined){
	// 		this.setLabelMin(minVal);
	// 	} else {
	// 		this.setLabelMin(this.binVals.min);
	// 	}

	// 	if (maxVal !== undefined){
	// 		this.setLabelMax(maxVal);
	// 	} else {
	// 		this.setLabelMax(this.binVals.max);
	// 	}

	// 	if (rangeVal !== undefined){
	// 		this.setLabelRange(rangeVal);
	// 	} else {
	// 		this.setLabelRange(this.binVals.min + " - " + this.binVal.max);
	// 	}
};

/**
 * Set value for bin minimum to specified value
 * 
 * @param {number} val - min bin value
 */ 
binMaster.Bin.prototype.setBinMin = function(val){
	if (val > this.binVals.max){console.log('Warning: Bin minimum value (' + val + ') is greater than Bin maximum (' + this.binVals.max + ')');}
	this.binVals.min = val;
	if (this.binVals.max != undefined){
		this.binVals.range = this.binVals.max - this.binVals.min;
	}
	this.setLabelDefn("DEFAULT", this.binVals.range, this.binVals.min, this.binVals.max);
	return this.binVals.min;
}

binMaster.Bin.prototype.getBinMin = function(){
	return this.binVals.min;
}

/**
 * Set value for bin maximum to specified value
 * 
 * @param {number} val - max bin value
 */ 
binMaster.Bin.prototype.setBinMax = function(val){
	if (val < this.binVals.min){console.log('Warning: Bin maximum value (' + val + ') is less than Bin minimum (' + this.binVals.min + ')');}
	this.binVals.max = val;
	if (this.binVals.min != undefined){
		this.binVals.range = this.binVals.max - this.binVals.min;
	}
	this.setLabelDefn("DEFAULT", this.binVals.range, this.binVals.min, this.binVals.max);
	return this.binVals.max;
}

binMaster.Bin.prototype.getBinMax = function(){
	return this.binVals.max;
}

binMaster.Bin.prototype.getBinRange = function(){
	return this.binVals.range;
}


/**
 * Visual encoding characteristics for one bin
 * 
 * @param {string} colorVal - color for the bin (in hex)
 */ 
binMaster.Bin.prototype.setColor = function(colorVal){
	if (colorVal === undefined){
		colorVal = DEFAULT_COLOR;
	}
	this.encodeVals = {
		color: chroma(colorVal)
	};
};

/**
 * Get color for a single Bin
 * 
 * @param {string} opt_format - format to use in returning the color (hsl, hsv, lab, lch, hcl, cmyk, gl, etc.  See chroma.js)  if not used, defaults to hex
 * @requires chroma.js
 * @return {string} color value in specified format (opt_format).  
 */ 
binMaster.Bin.prototype.getColor = function(opt_format){
	if (opt_format === undefined){opt_format = 'hex';}
	return this.encodeVals.color[opt_format]();
}

/**
 * Set label for low end of the range for a bin (not required); label is a string
 * 
 * @param {number, string} minVal - either string or numeric value to use in labeling.  
 * @param {string} opt_labelName - optional label name.  If label name is undefined, set to DEFAULT, otherwise creates it
 */ 
binMaster.Bin.prototype.setLabelMin = function(minVal, opt_labelName){
	var labelName;
	labelName = this._getLabelName(opt_labelName);

	this.labelVals[labelName].minLabel = minVal.toString();
}

binMaster.Bin.prototype._getLabelName = function(labelName){
	if (labelName === undefined){ 
		labelName = 'DEFAULT';
		// console.log('Label name not provided, updating DEFAULT labels instead');
		return labelName;
	}
	
	if (Object.keys(this.labelVals).indexOf(labelName) === -1){
		// console.log(labelName + ' does not exist in the label definition; it has now been created for use.');
		this.labelVals[labelName] = {};
		return labelName;
	}

	return labelName;
}

/**
 * Set label for high end of the range for a bin (not required); label is a string
 * 
 * @param {number, string} maxVal - either string or numeric value to use in labeling.  
 * @param {string} opt_labelName - optional label name.  If label name is undefined, set to DEFAULT, otherwise creates it
 */ 
binMaster.Bin.prototype.setLabelMax = function(maxVal, opt_labelName){
	var labelName;
	labelName = this._getLabelName(opt_labelName);

	this.labelVals[labelName].maxLabel = maxVal.toString();
}

/**
 * Set label for range for a bin (not required); label is a string
 * 
 * @param {string} rangeVal - string to use in labeling.  
 * @param {string} opt_labelName - optional label name.  If label name is undefined, set to DEFAULT, otherwise creates it
 */ 
binMaster.Bin.prototype.setLabelRange = function(rangeVal, opt_labelName){
	var labelName;
	labelName = this._getLabelName(opt_labelName);

	this.labelVals[labelName].rangeLabel = rangeVal.toString();
}


binMaster.Bin.prototype.printBinLabel = function(labelName){
	if (labelName === undefined || Object.keys(this.labelVals).indexOf(labelName) === -1 ){ labelName = 'DEFAULT';}
	console.log(this.labelVals[labelName].minLabel);
	console.log(this.labelVals[labelName].rangeLabel);
	console.log(this.labelVals[labelName].maxLabel);
}
