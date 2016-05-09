

var binMaster = {};
/**
 * @constructor; optional inputs to define range of bin (minVal, maxVal), and color for encoding
 */
binMaster.Bin = function (minVal, maxVal, color) {
	this.set_numericDefn(minVal, maxVal);
	this.set_encodingDefn(color);
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

	// if a DEFAULT labelDefn already exists, update it
	if (this.labelVals){
		// update the label definition with new numeric definition (pass a null for Range; will be set in set_labelDefn)
		this.set_labelDefn("DEFAULT", null, this.binVals.min, this.binVals.max)
	} else{
		return; // no labelVals exists, so no need to update
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

	this.labelVals[labelName] = {
		rangeLabel: rangeVal, // label for entire class - if not specified, default to "binVals.min - binVals.max"
		minLabel: minVal, // label for lower range of the bin 
		maxLabel: maxVal // label for higher range of the bin
	}
}