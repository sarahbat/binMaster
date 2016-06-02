/**
 * @fileoverview binMgr.js manages a set of statistical bins
 */
'use strict';

var xp3 = xp3 || {};


/**
 * @param{Array} opt_data is optionally an array of data to bin
 * @param{Number} opt_binCount is optionally the number of bins to use
 * @param{Number} opt_min is optionally the lower bound
 * @param{Number} opt_max is optionally the upper bound
 * @constructor
 */
xp3.BinMgr = function (opt_data, opt_binCount, opt_min, opt_max) {
  this.binCount = null;
  this.binList = [];
  this.binMax = null;
  this.binMin = null;
  this.data = null;

  // initialize the state
  this.load(opt_data, opt_binCount, opt_min, opt_max);
};


xp3.BinMgr.TOO_LOW_BIN = 'TOO_LOW_BIN';
xp3.BinMgr.TOO_HIGH_BIN = 'TOO_HIGH_BIN';



/**
 * initialize the state and load the data.
 * @param{Array} data is the data to bin or null
 * @param{Number} opt_binCount is optionally the number of bins to use
 * @param{Number} opt_min is optionally the lower bound
 * @param{Number} opt_max is optionally the upper bound
 */
xp3.BinMgr.prototype.load = function (data, opt_binCount, opt_min, opt_max) {
  this.binCount = opt_binCount || this.binCount;
  this.binMin = opt_min || this.binMin;
  this.binMax = opt_max || this.binMax;
  this.binList = [];
  this.data = data;

  if (this.data) {
    this.computeBinList();
  }

  return this;
};


/**
 * Compute the bins for the data
 */
xp3.BinMgr.prototype.computeBinList = function () {
  if (!this.data) {
    return;
  }

  // determine the min and max
  var dataCount = this.data.length;
  if (!this.binMin && !this.binMax) {
    this.binMin = this.data[0];
    this.binMax = this.data[0];
    for (var i = 1; i < dataCount; ++i) {
      if (this.binMin > this.data[i]) {
        this.binMin = this.data[i];
      }
      if (this.binMax < this.data[i]) {
        this.binMax = this.data[i];
      }
    }
  } else {
    if (!this.binMin) {
      this.binMin = this.data[0];
      for (var i = 1; i < dataCount; ++i) {
        if (this.binMin > this.data[i]) {
          this.binMin = this.data[i];
        }
      }
    } else if (!this.binMax) {
      this.binMax = this.data[0];
      for (var i = 1; i < dataCount; ++i) {
        if (this.binMax < this.data[i]) {
          this.binMax = this.data[i];
        }
      }
    }
  }

  // if the min and max are not whole numbers, nudge them
  this.binMin = Math.floor(this.binMin);
  this.binMax = Math.ceil(this.binMax);


  // compute the number of bins or use the one the user set
 // TODO fix this to be the correct bin count computation
  var computedLog = Math.min(Math.max(5, Math.ceil(Math.log(dataCount))), 20);
  this.binCount = this.binCount || computedLog;
  this.binWidth = (this.binMax - this.binMin) / this.binCount;

  // create bins to hold outOfRange values
  this.tooLowBin = new xp3.Bin(Number.NEGATIVE_INFINITY,
                               this.binMin - Number.EPSILON);

  this.tooHighBin = new xp3.Bin(this.binMax + Number.EPSILON,
                                Number.POSITIVE_INFINITY);

  // create the regular bins
  var low = this.binMin;
  var high = low + this.binWidth;
  for (var i = 0; i < this.binCount; ++i) {
    this.binList[i] = new xp3.Bin(low, high);
    low = high + Number.EPSILON;
    high = this.binMin + ((i + 2) * this.binWidth);
  }

  // sort the data into the bins
  var added = false;
  var filteredOut = false;
  for (var i = 0; i < dataCount; ++i) {
    added = false;
    filteredOut = false;

    // if (this.data[i] === 749500){
    //   filteredOut = true;
    // }

    if (!filteredOut){
      for (var j = 0; j < this.binCount; ++j) {
        added = this.binList[j].tryToAdd(this.data[i]);
        if (added) {
          break;
        }
      }
    }

    if (!added) {
      added = this.tooLowBin.tryToAdd(this.data[i]);
    }

    if (!added) {
      added = this.tooHighBin.tryToAdd(this.data[i]);
//    console.log(i, j, this.data[i], this.binList[this.binCount-1].getMax());
    }
  }
};


/**
 *
 */
xp3.BinMgr.prototype.getBinCount = function () {
  return this.binCount;
};


/**
 *
 */
xp3.BinMgr.prototype.getBinWidth = function () {
  return this.binWidth;
};


/**
 *
 */
xp3.BinMgr.prototype.getBinMin = function () {
  return this.binMin;
};


/**
 *
 */
xp3.BinMgr.prototype.getBinMax = function () {
  return this.binMax;
};


/**
 * @param {Number} range or xp3.BinMgr.TOO_LOW_BIN or xp3.BinMgr.TOO_HIGH_BIN
 */
xp3.BinMgr.prototype.getBin = function (index) {
  if (index === xp3.BinMgr.TOO_LOW_BIN) {
    return this.tooLowBin;
  } else if (index === xp3.BinMgr.TOO_HIGH_BIN) {
    return this.tooHighBin;
  }

  if (index < 0 || index > this.binCount) {
    return null;
  }

  return this.binList[index];
};



/**
 * @return {min, max, count}
 */
xp3.BinMgr.prototype.getDataMinMaxCount = function () {
  var min = this.data[0];
  var max = this.data[0];
  var dataCount = this.data.length;

  for (var i = 1; i < dataCount; ++i) {
    if (min > this.data[i]) {
      min = this.data[i];
    }
    if (max < this.data[i]) {
      max = this.data[i];
    }
  }

  return {min:min, max:max, count:dataCount};
};



