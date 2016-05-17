/**
 * @fileoverview binList.js defines the BinList object.  
 * A BinList consists of sets of bins
 * 				 
 */
'use strict';

/**
 * optional inputs to define the number of bins in the list. 
 * @param {number} binParam - object or number 
 * @constructor 
 */
binMaster.BinList = function (binParam){
// numBins, binBreaks){
	// TODO: refine to streamline creation of empty Bins and to populate (if info is provided)
	if (typeof binParam === "number"){ // BinList defined to be specified length
		this.bins = new Array(binParam);
		if (binParam > 0){
			for (var i = 0; i < binParam; i++){
				this.bins[i] = new binMaster.Bin;
			}
		}
	} else if (typeof binParam === "object"){ // BinList defined to have specified breaks
		binParam.sort(function(a, b){return a-b}); // make sure they are in ascending order

		this.bins = new Array(binParam.length - 1); // an array of breaks is one longer than number of classes 
		for (var i = 0; i < binParam.length - 1; i++){
			this.bins[i] = new binMaster.Bin;
		}
		// set bin values based on array-specified breaks
		for (var i = 0; i < binParam.length - 1; i++){
			this.bins[i].setBinMin(binParam[i]);
			this.bins[i].setBinMax(binParam[i+1]); // binBreaks should always be numBins + 1
		}
	} else { // BinList initialized without definition
		this.bins = new Array();
	}
	this.outRangeBin_high = new binMaster.Bin;
	this.outRangeBin_low = new binMaster.Bin;
	this.binMax = undefined;
	this.binMin = undefined; // to store the overall range of bin values

	if (typeof binParam === "object"){
		this.binMax = binParam[binParam.length-1];
		this.binMin = binParam[0];
	}

}


/**
 * Get one Bin by Bin number 
 * 
 * @param {number} binNumber - the number of the bin to return (between 0 and BinList length)
 * @return {object} - Bin object
 */ 
binMaster.BinList.prototype.getBinNumber = function (binNumber){
	if (binNumber < this.bins.length){
		return this.bins[binNumber];
	} else {
		console.log("The binNumber (", binNumber, ") is not valid.  There are only", this.bins.length, "bins");
		return;
	}
}

/**
 * Get bin for numbers greater than the max bin in the BinList
 * 
 * @return {object} Bin definition for out of range (high)
 */ 
binMaster.BinList.prototype.getOutRangeBin_high = function(){
	return this.outRangeBin_high;
}

/**
 * Get bin for numbers less than the min bin in the BinList
 * 
 * @return {object} Bin definition for out of range (low)
 */ 
binMaster.BinList.prototype.getOutRangeBin_low = function(){
	return this.outRangeBin_low;
}

/**
 * Identify the bin that a specified value falls into
 *
 * @param {number} dataVal - The value to be found in the bins
 * @return {number} Bin number (in BinList array)
 */ 
binMaster.BinList.prototype.getBin = function(dataVal){
	for (var i = 0; i < this.bins.length; i++){
		if(this.bins[i].binVals.min != undefined && this.bins[i].binVals.max != undefined){
			if (inRange(dataVal, this.bins[i].binVals.min, this.bins[i].binVals.max)){
				return i;
			}
		}
	}

	function inRange(dataVal, min, max){
		if (dataVal > min && dataVal <= max){
			return true;
		} 
		return false;
	}
}

/**
 * Set minimum value for the BinList based on smallest value in all Bins in the BinList
 *
 */ 
binMaster.BinList.prototype.setMin = function(){
	var min;
	for (var i = 0; i < this.bins.length; i++){
		if(this.bins[i].binVals.min != undefined && this.bins[i].binVals.max != undefined){
			if (min === undefined) { min = this.bins[i].binVals.min;}
			else {
				if (this.bins[i].binVals.min < min){
					min = this.bins[i].binVals.min;
				}
			}
		}
	}
	this.binMin = min; 
}

/**
 * Set maximum value for the BinList based on largest value in all Bins in the BinList
 *
 */ 
binMaster.BinList.prototype.setMax = function(){
	var max;
	for (var i = 0; i < this.bins.length; i++){
		if(this.bins[i].binVals.min != undefined && this.bins[i].binVals.max != undefined){
			if (max === undefined) { max = this.bins[i].binVals.max;}
			else {
				if (this.bins[i].binVals.max > max){
					max = this.bins[i].binVals.max;
				}
			}
		}
	}
	this.binMax = max; 
}

/**
 * Set minimum & maximum value at same time for the BinList based on smallest/largest value in all Bins in the BinList
 *
 */ 
binMaster.BinList.prototype.setMinMax = function(){
	var max, min;
	for (var i = 0; i < this.bins.length; i++){
		if(this.bins[i].binVals.min != undefined && this.bins[i].binVals.max != undefined){
			if (max === undefined) { max = this.bins[i].binVals.max;}
			if (min === undefined) { min = this.bins[i].binVals.min;}
			else {
				if (this.bins[i].binVals.max > max){
					max = this.bins[i].binVals.max;
				}
				if (this.bins[i].binVals.min < min){
					min = this.bins[i].binVals.min;
				}
			}
		}
	}
	this.binMax = max; 
	this.binMin = min;
}

binMaster.BinList.prototype.printBins = function(labelName){
	if (labelName === undefined){
		labelName = "DEFAULT";
	}
	if (this.bins[i][labelName] === undefined){ // label is not in use; use Default instead
		console.log('The label' + labelName + 'is not a valid name in use in the Bins');
		labelName = "DEFAULT"; 
	}

	for (var i = 0; i < this.bins.length; i++){
		console.log(this.bins[i].labelVals[labelName].rangeLabel);
	}
	return;
}

/**
 * @return array of bin breaks [min, class1Max, class2Max, ..., max]
 *
 */ 
binMaster.BinList.prototype.getBinBreaks = function(){
	var binBreaks = [];
	binBreaks.push(this.bins[0].getBinMin());
	for (var i = 0; i < this.bins.length; i++){
		binBreaks.push(this.bins[i].getBinMax());
	}
	return binBreaks;
}