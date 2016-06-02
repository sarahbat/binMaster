/**
 * @fileoverview tableCard.js creates a table of the data
 */
'use strict';

var xp3 = xp3 || {};
var useful = useful || {};


/**
 * @constructor
 */
xp3.TableCard = function (parent, dataMgr) {
  this.container = useful.Dom.createDiv(parent, 'tableCardContainer');
  this.dataMgr = dataMgr;

  this.showData();
};


/**
 * Show the current data in the dataMgr
 */
xp3.TableCard.prototype.showData = function() {
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
