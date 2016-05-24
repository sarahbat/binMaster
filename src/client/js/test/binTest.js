// assorted functionality tests

var binTest = {};
var bTest = {};
var filter = {}; // generic filter values for testing
const NULL_VAL = -9999;
const NO_DATA = '.'; // blank cells should be set to '.' in the initial data load
const FILTER_VAL = -99999; // place holder to mark values that have been 'filtered out'


function makeTestData(numberBins){
	if (numberBins === undefined){numberBins = 5;}
	bTest = new binMaster.BinList(numberBins);

	// add some values to the bins 
	var STEP_SIZE = 5;
	for (var i = 0; i < numberBins; i++){
		var minVal = STEP_SIZE * i;
		bTest.bins[i].setBinMin(minVal);
		bTest.bins[i].setBinMax(minVal + STEP_SIZE);
	}
}


function testBins(){
	// make a 5 class binList 
	var binListTest = new binMaster.BinList(5);

	// add some values to the bins 
	var STEP_SIZE = 5;
	for (var i = 0; i < 5; i++){
		var minVal = STEP_SIZE * i;
		binListTest.bins[i].setBinMin(minVal);
		binListTest.bins[i].setBinMax(minVal + STEP_SIZE);
	}

	// find which bin has which values
	binListTest.getBin(12);

	// test out with the dataMgr and an array of breaks
	var b = new binMaster.BinList([0, 1000, 5000, 10000, 25000, 50000, 100000])
	var data = binMaster.dataMgr.getColumn('FIPS');
	for (var i = 0; i < data.length; i++) {
		console.log(data[i], 'is in class', b.getBin(data[i]));
	}


	// test out with geostats.js to define the bins statistically
	var data = binMaster.dataMgr.getColumn('FIPS');
	var breaks = binMaster.dataMgr.getBins(data, 'Quantile', 5);
	var bins = new binMaster.BinList(breaks);
	// // should return an out of range
	bins.getBin(12);
}

function loadMapTestData(){
	d3map.loadTopoJSON('./data/us_noAKHI.json');
}

function testMap(breakType){
	if (breakType === undefined){ breakType = 'EqualInterval';}
	
	binMaster.dataMgr.key = 'FIPS';

	d3.select('.test').remove();
	map_div = d3map.makeMapDiv(null, 'test', 500, 500); // 500px square div
	map_svg = d3map.makeMapSVG(map_div);
	d3map.drawTopoJSON(map_svg, d3map.data, 'counties', 'id');
	binTest.data = binMaster.dataMgr.getColumn('PCT_04');
	// get class breaks
	binTest.breaks = binMaster.dataMgr.getBins(binTest.data, breakType, 5);
	binTest.binList = new binMaster.BinList(binTest.breaks);
	binTest.binnedData = [];
	binTest.id = binMaster.dataMgr.getColumn(binMaster.dataMgr.key); // retrieve column set as key field

	binTest.binList.setColorEncoding(5);

	for (var i = 0; i < binTest.data.length; i++) {
		binTest.binnedData.push({'id': [binTest.id[i]], 'value': binTest.binList.getBin(binTest.data[i])});
	}

	d3map.encodeMap('counties', binTest.binnedData, binTest.binList); // encode and link FIPS code to NUM_04 attribute
}

function testMap_null(breakType){
	if (breakType === undefined){ breakType = 'EqualInterval';}
	
	binMaster.dataMgr.key = 'FIPS';

	d3.select('.test').remove();
	map_div = d3map.makeMapDiv(null, 'test', 500, 500); // 500px square div
	map_svg = d3map.makeMapSVG(map_div);
	d3map.drawTopoJSON(map_svg, d3map.data, 'counties', 'id');

	attr = 'WEST_04_NODATA';

	filter.state = 'California';
	filter.constrain_min = 12;
	filter.constrain_max = 20;

	matchFn = function(r){return r[attr] !== NULL_VAL;}

	console.log('Length all rows: ' + binMaster.dataMgr.getRows().length)
	console.log('Length all rows - null values: ' + binMaster.dataMgr.getRows(matchFn).length)

	// make dataset with all values and cleaned dataset (no null, no no-data values)
	binTest.all_data = binMaster.dataMgr.getColumn(attr);
	binTest.cleaned_data = cleanData(attr, NULL_VAL, NO_DATA);

	// get class breaks
	binTest.breaks = binMaster.dataMgr.getBins(binTest.cleaned_data, breakType, 5);
	binTest.binList = new binMaster.BinList(binTest.breaks);
	binTest.binList.setNullVal(NULL_VAL); // set to PCT_04 for Santa Barbara county
	binTest.binnedData = [];
	binTest.id = binMaster.dataMgr.getColumn(binMaster.dataMgr.key); // retrieve column set as key field

	binTest.binList.setColorEncoding(5);

	for (var i = 0; i < binTest.all_data.length; i++) {
		binTest.binnedData.push({'id': binTest.id[i], 'bin': binTest.binList.getBin(binTest.all_data[i])});
	}

	d3map.encodeMap('counties', binTest.binnedData, binTest.binList); // encode and link FIPS code to NUM_04 attribute

	function cleanData(attr, nullVal, noDataVal){
		var noNull = fm.removeRowsByAttribute(attr, nullVal);
		return fm.getColumn(attr, fm.removeRowsByAttribute(attr, noDataVal, noNull));
	}
}

function filter_redraw(filterField, filterValue){
	// filter the data
	var all_data = binMaster.dataMgr.getColumn(attr);
	var cleaned_data = fm.removeRowsByAttribute(filterField, filterValue);

	// use existing bins - do not re-bin; just update which IDs are binned
	for (var i = 0; i < binTest.all_data.length; i++) {
		binTest.binnedData.push({'id': [binTest.id[i]], 'value': binTest.binList.getBin(binTest.all_data[i])});
	}

	// update the map


}
