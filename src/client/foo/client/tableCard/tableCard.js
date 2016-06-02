/**
 * @fileoverview tableCard.js creates a table of the data
 */
'use strict';

var eviza = eviza || {};
var common = common || {};


/**
 * @constructor
 */
eviza.TableCard = function (parent, dataMgr, eventMgr) {
  this.container = common.Dom.createDiv(parent, 'tableCardContainer');
  this.dataMgr = dataMgr;
  this.eventMgr = eventMgr;

  // add an event listener for changes to the data manager
  this.eventMgr.addEventListener(eviza.EventMgr.CHANGE_EVENT,
                                 this.handleDataMgrChange.bind(this));
  

  this.showData();
};


/**
 * When the dataMgr has a change, re-show the data
 */
eviza.TableCard.prototype.handleDataMgrChange = function() {
  this.showData();
};


/**
 * Show the current data in the dataMgr
 */
eviza.TableCard.prototype.showData = function() {
  // show some houses from the dataMgr
  var matchFn = function(r) { return r['LIST PRICE'] > 4000000; };
  var rowList = this.dataMgr.getRows(matchFn);

  var rowCount = rowList.length;
  var html = ['<table>'];
  html.push('<tr><td><b>Address</b></td><td><b>List Price</b></td></tr>');     
  for (var i = 0; i < rowCount; ++i) {
    html.push('<tr>' +
                '<td>'+ rowList[i]['ADDRESS'] + '</td>' +
                '<td>'+ rowList[i]['LIST PRICE'] + '</td>' +
              '</tr>');
  }
  html.push('</table');

  this.container.innerHTML = html.join('');
};
