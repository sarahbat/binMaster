/**
 * @fileoverview contextCard.js creates a context of the data
 */
'use strict';

var eviza = eviza || {};
var common = common || {};


/**
 * @constructor
 */
eviza.ContextCard = function (parent, dataMgr, eventMgr) {
  this.container = common.Dom.createDiv(parent, 'contextCardContainer');
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
eviza.ContextCard.prototype.handleDataMgrChange = function() {
  this.showData();
};


/**
 * Show the current data in the dataMgr
 */
eviza.ContextCard.prototype.showData = function() {

  // find this address and show it as a who, what, when, where
  var matchFn = function(r) { return r['ADDRESS'] === '28080 Laura Ct';};
  var rowList = this.dataMgr.getRows(matchFn);

  var html = ['<b>Context Card</b><br>' + '<table>'];

  if (rowList && rowList.length > 0) {
    var row = rowList[0];
    html.push('<tr><td><b>who:</b></td><td>' + 
               row['ORIGINAL SOURCE'] + '</td></tr>');

    html.push('<tr><td><b>what:</b></td><td>' +
               row['HOME TYPE'] + '</td></tr>');

    html.push('<tr><td><b>when:</b></td><td>' +
               row['DAYS ON MARKET'] + '</td></tr>');

    html.push('<tr><td><b>where:</b></td><td>' +
               row['ADDRESS'] + '</td></tr>');

    html.push('<tr><td><b>how much:</b></td><td>' +
               row['LIST PRICE'] + '</td></tr>');
  }
  html.push('</table');

  this.container.innerHTML = html.join('');
};
