/**
 * @fileoverview eventMgr.js provides a way for components to communicate
 *    that there has been an update to the data.
 */
'use strict';

var eviza = eviza || {};

/**
 * @constructor
 */
eviza.EventMgr = function () {

};

eviza.EventMgr.CHANGE_EVENT = 'changeEvent';
eviza.EventMgr.SELECTION_EVENT = 'selectionEvent';


/**
 *
 */
eviza.EventMgr.prototype.addEventListener = function (event, fn) {
  document.body.addEventListener(event, fn, false);  
};


/**
 *
 */
eviza.EventMgr.prototype.dispatchEvent = function (eventName) {
  var event = new Event(eventName);
  document.body.dispatchEvent(event);  
};


/**
 *
 */
eviza.EventMgr.prototype.dispatchChangeEvent = function () {
  this.dispatchEvent(eviza.EventMgr.CHANGE_EVENT);
};


/**
 *
 */
eviza.EventMgr.prototype.dispatchSelectionEvent = function () {
  this.dispatchEvent(eviza.EventMgr.SELECTION_EVENT);
};
