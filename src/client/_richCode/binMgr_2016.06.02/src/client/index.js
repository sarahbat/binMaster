/**
 * @fileoverview index.js example using dataMgr, eventMgr to communicate.
 */
'use strict';

var xp3 = xp3 || {};
var useful = useful || {};


/**
 * @constructor
 */
xp3.Main = function () {
  // once the data has loaded, then call init
  this.dataSource = 'data/obesity_data.csv';
  this.dataMgr = new xp3.DataMgr(this.dataSource, this.init.bind(this));
};

/**
 * Once the csv file has loaded, this method is called to intialize the app.
 */
xp3.Main.prototype.init = function() {
  this.root = document.body;
  this.createDataDescriptionCard(this.root);
  this.tableCard = new xp3.TableCard(this.root, this.dataMgr);

  var priceList = this.dataMgr.getColumn('WEST_04');
 this.binMgr = new xp3.BinMgr(priceList);  // nothing specified
 // this.binMgr = new xp3.BinMgr(priceList, 5);  // bin count specified
  // this.binMgr = new xp3.BinMgr(priceList, null, 100000, 1000000); // range spec



  this.createBinCard(this.root);
};



/**
 * Create a little card that shows the data source, row&col counts, col names.
 */
xp3.Main.prototype.createDataDescriptionCard = function(parent) {
  this.dataDescriptionCard =
      useful.Dom.createDiv(this.root, 'dataDescriptionCard');

  this.dataDescriptionCard.innerHTML =
      '<div style="font-size:16px;font-weight:bold">data description</div>' +
      '<b>data source: </b>' + this.dataSource + '<br>' +
      '<b>rows: </b>' + this.dataMgr.getRowCount() + '<br>' +
      '<b>columns: </b>' + this.dataMgr.getColumnCount() + '<br>' +
      '<b>column names: </b>' + this.dataMgr.getColumnNames();
};



/**
 * Create a little card that shows the bins
 */
xp3.Main.prototype.createBinCard = function(parent) {
  var html = ['<div style="font-weight:bold">Bins:</div>'];

  var d = this.binMgr.getDataMinMaxCount();
  html.push('<div>');
  html.push('data count: ', d.count);
  html.push(' min: ', d.min);
  html.push(' max: ' , d.max);
  html.push('<br>');
  html.push('bin count: ', this.binMgr.getBinCount());
  html.push(' bin width: ' , Math.floor(this.binMgr.getBinWidth()));
  html.push('</div>');

  html.push('<br>');

  html.push('<table>');

  var bin = this.binMgr.getBin(xp3.BinMgr.TOO_LOW_BIN);
  html.push(['<tr style="background-color: rgb(230, 230, 230)"><td>',
             'below ', Math.ceil(bin.getMax()), ' : ', '</td>',
             '<td></td>',
             '<td>', bin.getCount(), '</td></tr>'].join(''));

  var binCount = this.binMgr.getBinCount();
  for (var i = 0; i < binCount; ++i) {
    var bin = this.binMgr.getBin(i);
    html.push(['<tr>',
               '<td>', 'bin ', i, '</td>',
               '<td>(', Math.floor(bin.getMin()), ' - ',
                      Math.floor(bin.getMax()), 
                 '):</td>',
               '<td>', bin.getCount(), '</td>',
               '</tr>'].join(''));
  }

  var bin = this.binMgr.getBin(xp3.BinMgr.TOO_HIGH_BIN);
  html.push(['<tr style="background-color: rgb(230, 230, 230)"><td>',
             'above ', Math.floor(bin.getMin()), ' : ', '</td>',
             '<td></td>',
             '<td>', bin.getCount(), '</td></tr>'].join(''));

  html.push('</table>');

  this.binCard = useful.Dom.createDiv(this.root, 'binCard');
  this.binCard.innerHTML = html.join('');

};



// start the app once the HTML dom has loaded
window.addEventListener('load', function () {xp3.main = new xp3.Main();});
