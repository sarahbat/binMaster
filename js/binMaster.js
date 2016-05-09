

var binMaster = {};
/**
 * @constructor
 */
binMaster.Bin = function () {
	this.numericDefn = new binMaster.Bin_NumericDefn();
	this.encodeDefn = new binMaster.Bin_EncodeDefn();
	this.labels = {}; // muliple labels can be used for any Bin
	// var _this = this;

	// get/set labels and initialize default label
	this.set_LabelDef = (function(definitionName) {
		this.labels[definitionName] = {minLabel: "undefined",maxLabel: "undefined",rangeLabel: "undefined"} ; // a bin may have multiple labels
	});
	this.get_LabelDef = (function(definitionName) {
		return this.labels[definitionName];
	});

	this.set_LabelDef('DEFAULT'); // initialize default label properties
};

/**
 * Numeric characteristics for one bin
 */ 
binMaster.Bin_NumericDefn = function(){
	this.min = undefined;
	this.max = undefined;
};

/**
 * visual encoding characteristics for one bin
 */
binMaster.Bin_EncodeDefn = function(){
	this.color = undefined;
};
