/**
 * @fileoverview bin.js provides a single bin
 * bins include the lower and upper bound
 */
'use strict';

var xp3 = xp3 || {};

/**
 * @constructor
 */
xp3.Bin = function (min, max) {
  this.min = min;
  this.max = max;
  this.count = 0;
};


/**
 * @return {Bool} true if the data was counted
 */
xp3.Bin.prototype.tryToAdd = function (data) {
  if (data >= this.min && data <= this.max) {
    this.count++;
    return true;
  }
  return false;
};


/**
 *
 */
xp3.Bin.prototype.getCount = function () {
  return this.count;
};


/**
 *
 */
xp3.Bin.prototype.getMin = function () {
  return this.min;
};


/**
 *
 */
xp3.Bin.prototype.getMax = function () {
  return this.max;
};
