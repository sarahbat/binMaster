/**
 * @fileoverview dataMgr.js provides access/an interface to the (csv) data.
 */
'use strict';

var eviza = eviza || {};
var common = common || {};
var d3 = d3 || {};

/**
 * @constructor
 */
eviza.DataMgr = function (dataPath, cb) {
  this.data = dataPath ? this.load(dataPath, cb) : null;
  this.columnNameList = [];
  this.colCount = 0;
  this.rowCount = 0;
};


/**
 * load a data file
 */
eviza.DataMgr.prototype.load = function (dataPath, opt_cb) {
  d3.csv(dataPath, function(data) {
    this.data = data.map(function(obj, index) {
      obj.id = index;       // add the index to the row
      obj.selectedFlag = false;
      return this._fixObj(obj);
    }.bind(this));

    // determine the column and row counts and create the list of column names
    this._recomputeRowsAndColumns();

    if (opt_cb) {
      opt_cb();
    }
  }.bind(this));
};


/**
 * @private
 * Determine the column and row counts and create the list of column names
 * We cache the number of rows and columns since computing them can
 * be expensive.
 */
eviza.DataMgr.prototype._recomputeRowsAndColumns = function () {
  this.colCount = 0;
  this.rowCount = 0;
  this.columnNameList = [];
  if (this.data && this.data.length > 0) {
    var obj = this.data[0];
    for (var prop in obj) {
      this.columnNameList.push(prop);
    }
    this.colCount = this.columnNameList.length;
    this.rowCount = this.data.length;
  }

};


/**
 * @private
 * Fix an object by converting its variables to numbers if need be.
 * For example, price is a string that converts to a number:
 * { home: 'one'; price: '1000'}  converts to { home: 'one'; price: 1000}
 */
eviza.DataMgr.prototype._fixObj = function (obj) {
  for (var prop in obj) {
    obj[prop] = isNaN(obj[prop]) ? obj[prop] : +obj[prop]; // string or number
  }
  return obj;
};


/**
 * @return {array} of string names for the columns
 */
eviza.DataMgr.prototype.getColumnNames = function () {
  return this.columnNameList;
};


/**
 * @return {number} rowCount
 */
eviza.DataMgr.prototype.getRowCount = function () {
  return this.rowCount;
};


/**
 * @return {number} colCount
 */
eviza.DataMgr.prototype.getColumnCount = function () {
  return this.colCount;
};


/**
 * @return access to the indexth row in the dataMgr.
 */
eviza.DataMgr.prototype.getRowByIndex = function (index) {
  if (index < 0 || index >= this.data.length) {
    return null;
  }
    
  return this.data[index];
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
eviza.DataMgr.prototype.getRows = function (matchFn) {
  var resultList = [];
  var argCount = arguments.length;

  if (argCount < 1) { // return all rows
    resultList = this.data;
  } else if (typeof arguments[0] === 'function') {  // we're using a matchFn
    matchFn = arguments[0];
    for (var row = 0; row < this.rowCount; ++row) {
      if (matchFn(this.data[row])) {
        resultList.push(this.data[row]);
      }
    }
  }

  return resultList;
};


/**
 * @param{string} name of the column to get
 * @return {array} array of values for the column or [] if not found;
 */
eviza.DataMgr.prototype.getColumn = function (columnName) {
  var resultList = [];
  if (this.rowCount < 1) {  // make sure there is data
    return resultList;
  }

  for (var row = 0; row < this.rowCount; ++row) {
    resultList[row] = this.data[row][columnName];
  }

  return resultList;
};



// TODO: consider breaking selection out into a selectionMgr class


/**
 * Sets an indexed item's selectedFlag to true or false
 * @param {object | array{object}} the object or array of objects to set
 * @param {boolean} value true or false
 */
eviza.DataMgr.prototype.setSelected = function (obj, value) {
  if (Array.isArray(obj)) {
    var count = obj.length;
    for (var i = 0; i < count; ++i) {
      obj[i].selectedFlag = !!value;
    }
  } else {
    obj.selectedFlag = !!value;  // turns value into a boolean
  }
};


/**
 * @return {boolean} true if the object's selectionFlag is true.
 */
eviza.DataMgr.prototype.isSelected = function (obj) {
  return obj.selectedFlag;
};


/**
 * Set all objects' selectedFlag to false
 */
eviza.DataMgr.prototype.clearAllSelected = function () {
  for (var i = 0; i < this.rowCount; ++i) {
    this.data[i].selectedFlag = false;
  }
};


/**
 * @return {array} all selected rows
 */
eviza.DataMgr.prototype.getAllSelected = function () {
  var resultList = [];
  for (var i = 0; i < this.rowCount; ++i) {
    if (this.data[i].selectedFlag) {
      resultList.push(this.data[i]);
    }
  }
  return resultList;
};
