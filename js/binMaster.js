/**
 * @fileoverview binMaster.js defines the Bin object.  A Bin consists of:
 * 				- numeric definition of bin extrema (min/max)
 *				- encoding definition
 * 				- label definition(s) with numeric and semantic definition of the bin class and extrema
 */
/*jslint nomen:true, plusplus:true, todo:true,  browser:true  */
'use strict';


var binMaster = {};
/**
 * @constructor; optional inputs to define range of bin (minVal, maxVal), and color for encoding
 */
binMaster.Bin = function (minVal, maxVal, color) {
	this.set_numericDefn(minVal, maxVal);
	this.set_encodingDefn(color); // could be extended to have different encoding objects for different purposes
	this.labelVals = {}; // default object for label values
	this.set_labelDefn("DEFAULT", minVal, maxVal); // always create a default label based on any specified min/max values
};

/**
 * Numeric characteristics for one bin
 */ 
binMaster.Bin.prototype.set_numericDefn = function(minVal, maxVal){
	this.binVals = {
		min: minVal, 
		max: maxVal, 
		range: maxVal-minVal
	};

	// if a DEFAULT labelDefn already exists, update it with new numeric definition (pass a null for Range; will be set in set_labelDefn)
	if (this.labelVals){
		this.set_labelDefn("DEFAULT", null, this.binVals.min, this.binVals.max)
	} 
}

/**
 * Visual encoding characteristics for one bin
 */
binMaster.Bin.prototype.set_encodingDefn = function(colorVal){
	this.encodeVals = {
		color: colorVal
	};
}

/**
 * Numeric or semantic  encoding characteristics for labeling bin.  
 * DEFAULT is set up when class is created, will always contain numeric entries
 */
binMaster.Bin.prototype.set_labelDefn = function(labelName, rangeVal, minVal, maxVal){
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
	}
}