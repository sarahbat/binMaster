// assorted functionality tests

var binTest = {};

function testBins(){
	// make a 5 class binList 
	var binTest = new binMaster.BinList(5);

	// add some values to the bins 
	var STEP_SIZE = 5;
	for (var i = 0; i < 5; i++){
		var minVal = STEP_SIZE * i;
		binTest.bins[i].setBinMin(minVal);
		binTest.bins[i].setBinMax(minVal + STEP_SIZE);
	}

	// find which bin has which values
	binTest.getBin(12);

	// test out with the dataMgr and an array of breaks
	var b = new binMaster.BinList([0, 1000, 5000, 10000, 25000, 50000, 100000])
	var data = binMaster.dataMgr.getColumn('FIPS');
	for (var i = 0; i < data.length; i++) {
		console.log(data[i], "is in class", b.getBin(data[i]));
	}


	// test out with geostats.js to define the bins statistically
	var breaks = binMaster.dataMgr.getBins('FIPS', 'Quantile', 5);
	var bins = new binMaster.BinList(breaks);
	// // should return an out of range
	bins.getBin(12);
}

function loadMapTestData(){
	d3map.loadTopoJSON('./data/us_noAKHI.json');
}

function testMap(breakType){
	if (breakType === undefined){ breakType = 'EqualInterval';}

	d3.select('.test').remove();
	map_div = d3map.makeMapDiv(null, 'test', 500, 500); // 500px square div
	map_svg = d3map.makeMapSVG(map_div);
	d3map.drawTopoJSON(map_svg, d3map.data, 'counties', 'id');
	// get class breaks
	binTest.breaks = binMaster.dataMgr.getBins('PCT_04', breakType, 5);
	binTest.bins = new binMaster.BinList(binTest.breaks);
	binTest.binnedData = [];
	binTest.id = binMaster.dataMgr.getColumn('FIPS');
	binTest.data = binMaster.dataMgr.getColumn('PCT_04');

	for (var i = 0; i < binTest.data.length; i++) {
		binTest.binnedData.push({'id': [binTest.id[i]], 'value': binTest.bins.getBin(binTest.data[i])});
	}

	d3map.encodeMap('counties', binTest.binnedData, 'YlGn', binTest.breaks.length-1); // encode and link FIPS code to NUM_04 attribute
}
