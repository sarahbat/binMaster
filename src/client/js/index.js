/**
 * @fileoverview index.js is the javascript main entry point for the app.
 */
/*jslint nomen:true, plusplus:true, todo:true,  browser:true  */
'use strict';



/**
 * @constructor
 */
binMaster.Main = function () {
  // once the data has loaded, then call init
  var dataSource = '../data/obesity_data.csv';
  console.log("Loading data from", dataSource);
  this.dataMgr = new binMaster.DataMgr(dataSource, binMaster.Main.prototype.init);
};

/**
 * Once the csv file has loaded, this method is called to intialize the app.
 */
binMaster.Main.prototype.init = function() {
	console.log("Data loaded...");  
	// var cols = binMaster.dataMgr.getColumnNames();

 //    for (var i in cols){
 //    	if (binMaster.dataMgr.getColumnType(cols[i]) === 'number'){
 //    		console.log(cols[i]);
	//     }
	// }
};

// Load up the data...
binMaster.Main();