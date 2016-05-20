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
	this.nullBin = new binMaster.Bin;
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
 * Since bin break values are single values (duplicated max of one class = min of next class)
 * Values are checked against being greater than bin Min
 * To avoid issues with values equal to lowest bin value, additional check is done if value is equal to the BinList.binMin
 *
 * @param {number} dataVal - The value to be found in the bins
 * @return {number} Bin number (in BinList array)
 * 
 */ 
binMaster.BinList.prototype.getBin = function(dataVal){
	for (var i = 0; i < this.bins.length; i++){
		if(this.bins[i].binVals.min != undefined && this.bins[i].binVals.max != undefined){
			if (dataVal === this.binMin){
				return 0; // it is equal to the min, so is in class 0
			} else if (inRange(dataVal, this.bins[i].binVals.min, this.bins[i].binVals.max)){
				return i;
			} 
		}
	}
	// dataVal wasn't found in any bin, so...
	console.log(dataVal + ' is not in the range of the BinList.  Min: ' + this.binMin + ' Max: ' + this.binMax);

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

/**
 * Relatively pretty print of bin breaks
 * 
 * @param {string} labelName - if custom labeling has been set, the name assigned to the label group (otherwise default labels) 
 */ 
binMaster.BinList.prototype.printBins = function(labelName){
	if (labelName === undefined){
		labelName = "DEFAULT";
	}
	if (this.bins[0].labelVals[labelName] === undefined){ // label is not in use; use Default instead
		console.log('The label ' + labelName + ' is not a valid name in use in the Bins; returning Default labels instead');
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

/**
 * Set color encoding for all bins in a BinList
 * Currently just returns up to a 5 class randomly selected color scheme
 * Will be plugged in to call Maureen's color selector widget based on number of bins and color scheme of interest
 * 
 * @param {string} colorScheme - description for color scheme (input specs to be defined...)
 *
 */ 
binMaster.BinList.prototype.setColorEncoding = function(colorScheme){
	var colors = get_colors(this.bins.length, colorScheme);
	for (var i = 0; i < this.bins.length; i++){
		this.bins[i].setEncodingDefn(colors[i]);
	}

	function get_colors(numberColors, colorScheme){
		var randomColorSchemes = [
			['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'],
			['#ffffb2','#fecc5c','#fd8d3c','#f03b20','#bd0026'],
			['#feebe2','#fbb4b9','#f768a1','#c51b8a','#7a0177'],
			['#f7f7f7','#cccccc','#969696','#636363','#252525']
		];

		var rand = getRandomInt(0, randomColorSchemes.length-1);
		return randomColorSchemes[rand];
	}

	/**
	 * Returns a random integer between min (inclusive) and max (inclusive)
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

/**
 * @return array of colors assigned to the bins in a BinList
 *
 */ 
binMaster.BinList.prototype.getEncoding = function(){
	var colors = [];
	for (var i = 0; i < this.bins.length; i++){
		// console.log(this.bins[i].encodeVals);
		colors.push(this.bins[i].encodeVals.color)
	}

	return colors;
}
