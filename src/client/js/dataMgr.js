/**
 * @fileoverview dataMgr.js provides univeral access to the (csv) data
 *               and interface abstractions.
 */
/*jslint nomen:true, plusplus:true, todo:true,  browser:true  */
'use strict';


/**
 * @constructor
 */
binMaster.DataMgr = function (dataPath, cb) {
  this.data = dataPath ? this.load(dataPath, cb) : null;
  this.columnNameList = [];
  this.colCount = 0;
  this.rowCount = 0;
  this.key = ""; // key field for joins
};


/**
 * load a data file
 */
binMaster.DataMgr.prototype.load = function (dataPath, cb) {
	d3.csv(dataPath, function(data){
		this.data = data.map(function(obj, index){
			obj.id = index; // add the index to the row
			return this._fixObj(obj, index);
		}.bind(this));

		this.colCount = this.columnNameList.length;
		this.rowCount = this.data ? this.data.length : 0;
		cb();
	}.bind(this));
};


/**
 * @private
 * Fix an object by converting its variables to numbers if need be.
 * For example, price is a string that converts to a number:
 * { home: 'one'; price: '1000'}  converts to { home: 'one'; price: 1000}
 */
binMaster.DataMgr.prototype._fixObj = function (obj, index) {
  var objVal;

  for (var prop in obj) {
    if (index === 0){this.columnNameList.push(prop);} // for first object, set the column names
    objVal = obj[prop] === '' ? '.' : obj[prop]; // replace no data with nullVal
    obj[prop] = isNaN(objVal) ? objVal : +objVal;
    // obj[prop] = isNaN(obj[prop]) || obj[prop] === '' ? obj[prop] : +obj[prop]; // string or number
  }
  return obj;
};


/**
 * @return {array} of string names for the columns
 */
binMaster.DataMgr.prototype.getColumnNames = function () {
  return this.columnNameList;
};


/**
 * @return {number} rowCount
 */
binMaster.DataMgr.prototype.getRowCount = function () {
  return this.rowCount;
};


/**
 * @return {number} colCount
 */
binMaster.DataMgr.prototype.getColumnCount = function () {
  return this.colCount;
};


/**
 * @return{array} of the requested rows:
 *   no params gets all rows
 *   a matching function returns the rows where the matchFn returns true.
 *   Examples:
 *     dm.getRows();  // returns all
 *     var matchFn = function(r) { return r["LIST PRICE"] > 1600000; };
 *     dm.getRows(matchFn);  // returns rows where list price > 1.6M
 */
binMaster.DataMgr.prototype.getRows = function (matchFn, obj) {
  var resultList = [];
  var argCount = arguments.length;

  if (argCount < 1) { // return all rows
    resultList = this.data;
  } else if (argCount == 1 && typeof arguments[0] === 'function') {  // we're using a matchFn
    var matchFn = arguments[0];
    for (var row = 0; row < this.rowCount; ++row) {
      if (matchFn(this.data[row])) {
        resultList.push(this.data[row]);
      }
    }
    // select from a given set of objects (facilitate select from selection)
  } else if (argCount == 2 && typeof arguments[0] === 'function'){
    var matchFn = arguments[0];
    for (var row = 0; row < obj.length; ++row) {
      if (matchFn(obj[row])) {
        resultList.push(obj[row]);
      }
    }
  }
  return resultList;
};


/**
 * @param{string} name of the column to get
 * @return {array} array of values for the column or [] if not found;
 */
binMaster.DataMgr.prototype.getColumn = function (columnName) {
  var resultList = [];
  if (this.rowCount < 1) {  // make sure there is data
    return resultList;
  }

  for (var row = 0; row < this.rowCount; ++row) {

    resultList[row] = this.data[row][columnName];
  }

  return resultList;
};


/**
 * @param{string} name of the column to check
 * @return {string} type of column ('mixed' if there are multiple data types)
 */
binMaster.DataMgr.prototype.getColumnType = function (columnName) {
  var colType;
  var rows = this.getColumn(columnName);
  for (var i in rows){
      if (i == 0){
        colType = typeof(rows[i]);
      } else {
        if (colType != typeof(rows[i])){
          return 'mixed';
        }
      }
  }
  return colType;
}


/**
 * Define a key field to use in data joins
 * 
 * @param {string} keyField - name of the key field
 * 
 */
binMaster.DataMgr.prototype.setKey = function (keyField) {
  if (this.getColumnNames().indexOf(keyField) !== -1){
    this.key = keyField;
    return;
  } else {
    console.log(keyField + ' is not a column name in the dataMgr.');
    return;
  }
};

/**
 * @param {array} dataArray - array of data to classify
 * @param {string} breakType - name of the class break method
 * @param {number} numberClasses - number of class breaks to use
 * 
 * @requires geostats.js
 *
 * @return {array} array of class breaks
 */
binMaster.DataMgr.prototype.getBins = function(dataArray, breakType, numberClasses){
    console.log('Getting class breaks...');
    var gsData = new geostats(dataArray);
    var bins;
    // grab classbreaks using geostats.js library
    switch (breakType.toLowerCase()) {
        case 'jenks':
            bins = gsData.getClassJenks(numberClasses);
            break;
        case 'equalinterval':
            bins = gsData.getClassEqInterval(numberClasses);
            break;
        case 'quantile':
            bins = gsData.getClassQuantile(numberClasses);
            break;
        default:
            alert('Unknown classification scheme selected\n[Jenks, EqualInterval, Quantile]');
            return;
    }
    return bins;
};