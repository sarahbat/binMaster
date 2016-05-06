

var binMaster = {};
/**
 * @constructor
 */
binMaster.Bin = function () {
	this.numericDefn = new binMaster.Bin_NumericDefn();
	this.encodeDefn = new binMaster.Bin_EncodeDefn();
	this.labelDefn = new binMaster.Bin_LabelDefn("DEFAULT");
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

/**
 * semantic definition for one bin.  Each bin may have multiple definitions.
 */
binMaster.Bin_LabelDefn = function(definitionName){
	this.labels = {}; 
	this.labels[definitionName] = binMaster.set_LabelDefn();
}

binMaster.set_LabelDefn = function(){
	return {minLabel: "undefined",maxLabel: "undefined",rangeLabel: "undefined"} ; // a bin may have multiple labels
}

binMaster.add_LabelDefn = function(definitionName){
	// add a new label defnition in the labels object
}

