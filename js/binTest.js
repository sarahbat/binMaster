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