/**
 * @fileoverview index.js example using dataMgr, eventMgr to communicate.
 */
'use strict';

var eviza = eviza || {};
var common = common || {};


/**
 * @constructor
 */
eviza.Main = function () {
  // once the data has loaded, then call init
  this.dataSource = 'data/redfin_paloAlto_region.csv';
  this.dataMgr = new eviza.DataMgr(this.dataSource, this.init.bind(this));
};

/**
 * Once the csv file has loaded, this method is called to intialize the app.
 */
eviza.Main.prototype.init = function() {
  this.root = document.body;

  // create a header to describe the data
  this.header = common.Dom.createDiv(this.root, 'header');
  this.header.innerHTML =
      '<b>data source: </b>' + this.dataSource + '<br>' +
      '<b>rows: </b>' + this.dataMgr.getRowCount() + ' ' +
      '<b>columns: </b>' + this.dataMgr.getColumnCount() + '<br>' +
      '<b>column names: </b>' + this.dataMgr.getColumnNames();

  this.eventMgr = new eviza.EventMgr();

  this.tableCard = new eviza.TableCard(this.root, this.dataMgr, this.eventMgr);
  this.contextCard = new eviza.ContextCard(this.root, this.dataMgr,
                                           this.eventMgr);

  this.changeDataButton = new common.Dom.createButton(this.root, 'button',
  'Change some data', this.handleChangeButtonPressed.bind(this));
};


/**
 * On button press, change the data and tell anyone listening to CHANGE event.
 */
eviza.Main.prototype.handleChangeButtonPressed = function() {
  // find this address and change its price
  var matchFn = function(r) { return r['ADDRESS'] === '28080 Laura Ct';};
  var rowList = this.dataMgr.getRows(matchFn);

  if (rowList && rowList.length > 0) {
    rowList[0]['LIST PRICE'] += 1;
    this.eventMgr.dispatchChangeEvent();
  }
};

// start the app once the HTML dom has loaded
window.addEventListener('load', function () {new eviza.Main();});
