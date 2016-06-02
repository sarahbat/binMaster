/**
 * @fileoverview bin.js provides a single bin
 * bins include the lower and upper bound
 */
'use strict';

var xp3 = xp3 || {};

/**
 * @constructor
 */
xp3.Bin = function (opt_min, opt_max) {
  this.min = opt_min || null;
  this.max = opt_max || null;
  this.count = 0;
};


/**
 * @param {Boolean} opt_inclusive include the max, otherwise up to the max
 * @return {Bool} true if the data was counted
 */
xp3.Bin.prototype.tryToAdd = function (data, opt_inclusive) {
  if (opt_inclusive) {
    if (data >= this.min && data <= this.max) {
      this.count++;
      return true;
    }
  } else {
    if (data >= this.min && data < this.max) {
      this.count++;
      return true;
    }
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
