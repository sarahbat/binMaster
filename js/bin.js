/**
 * @fileoverview bin.js defines the Bin object.  A Bin consists of:
 * 				- numeric definition of bin extrema (min/max)
 *				- encoding definition
 * 				- label definition(s) with numeric and semantic definition of the bin class and extrema
 */
/*jslint nomen:true, plusplus:true, todo:true,  browser:true  */
"use strict";

// TODO: JSDoc markup...

/**
 * @param {number} opt_minVal - minimum bin value
 * @param {number} opt_maxVal - maximum bin value
 * @param {string} opt_color - color for the bin (in hex)
 *  
 * @constructor
 */
binMaster.Bin = function (opt_minVal, opt_maxVal, opt_color) {
	this.setNumericDefn(opt_minVal, opt_maxVal);
	this.setEncodingDefn(opt_color); // could be extended to have different encoding objects for different purposes
	this.labelVals = {}; // default object for label values
	this.setLabelDefn("DEFAULT", opt_minVal, opt_maxVal); // always create a default label based on any specified min/max values
};

/**
 * Numeric characteristics for one bin 
 * sets min, max, and calculates range
 * 
 * @param {number} opt_minVal - an optional minimum value for the bin
 * @param {number} opt_maxVal - an optional maximum value for the bin 
 */ 
binMaster.Bin.prototype.setNumericDefn = function(opt_minVal, opt_maxVal){
	this.binVals = {
		min: opt_minVal, 
		max: opt_maxVal, 
		range: opt_maxVal-opt_minVal
	};

	// if a DEFAULT labelDefn already exists, update it with new numeric definition (pass a null for Range; will be set in set_labelDefn)
	if (this.labelVals){
		this.set_labelDefn("DEFAULT", null, this.binVals.min, this.binVals.max);
	} 
};

binMaster.Bin.prototype.setBinMin = function(val){
	this.binVals.min = val;
	if (this.binVals.max != undefined){
		this.binVals.range = this.binVals.max - this.binVals.min;
	}

	return this.binVals.min;
}

binMaster.Bin.prototype.setBinMax = function(val){
	this.binVals.max = val;
	if (this.binVals.min != undefined){
		this.binVals.range = this.binVals.max - this.binVals.min;
	}
	
	return this.binVals.max;
}


/**
 * Visual encoding characteristics for one bin
 */
binMaster.Bin.prototype.setEncodingDefn = function(colorVal){
	this.encodeVals = {
		color: colorVal
	};
};

/**
 * Numeric or semantic  encoding characteristics for labeling bin.  
 * DEFAULT is set up when class is created, will always contain numeric entries
 */
binMaster.Bin.prototype.setLabelDefn = function(labelName, rangeVal, minVal, maxVal){
	if (labelName === "DEFAULT"){ // if this is the initialization, set the min/max to the object min/max (if they were already defined)
		minVal = this.binVals.min;
		maxVal = this.binVals.max;
		rangeVal = minVal + " - " + maxVal;
	}

	if (rangeVal === undefined){
		rangeVal = minVal + " - " + maxVal;  // label for class - if not specified, default to "binVals.min - binVals.max"
	}

	this.labelVals[labelName] = {
		rangeLabel: rangeVal, 
		minLabel: minVal,  
		maxLabel: maxVal 
	};
};
