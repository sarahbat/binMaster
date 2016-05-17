// assorted functionality tests
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