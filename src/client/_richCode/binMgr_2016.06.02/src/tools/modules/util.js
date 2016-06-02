/**
 * @fileoverview util.js contains utility functions for the build modules.
 */
'use strict';

var childProcess = require('child_process');
var fs = require('fs-extra');
var path = require('path');

/**
 * @constructor
 */
var Util = function() {};

// class variables
Util.longMonthList = ['January', 'February', 'March', 'April',
                      'May', 'June', 'July', 'August',
                      'September', 'October', 'November', 'December'];


/**
 * @return {string} return the date in the form: 12 April 2016 8:57:23pm
 */
Util.prototype.prettyDate = function(opt_date) {
  var date = opt_date ? opt_date : new Date();
  var yyyy = date.getFullYear();
  var mmm = Util.longMonthList[date.getMonth()];
  var dd = date.getDate();

  var hh = date.getHours();
  var ampm = hh < 12 ? 'am' : 'pm';
  hh = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh;

  var nn = date.getMinutes();
  nn = (nn < 10) ? ['0', nn].join('') : nn;

  var ss = date.getSeconds();
  ss = (ss < 10) ? ['0', ss].join('') : ss;
  var timeStr = [hh, ':', nn, ':', ss, ampm].join('');

  return [dd, mmm, yyyy, timeStr].join(' ');
};


/**
 * @return {string} a string in the format: .yyyy.mm.dd. (e.g. .2016.04.03.)
 */
Util.prototype.createDateString = function() {
  var date = new Date();
  var yyyy = date.getFullYear();
  var mm = this.prefixZero(date.getMonth() + 1);
  var dd = this.prefixZero(date.getDate());

  return [yyyy,mm,dd].join('.');
};


/**
 * @param {String} dirPath is the directory path string to be fixed.
 * @return {string} return the dirPath normalized and with front slashes.
 */
Util.prototype.slash = function(dirPath) {
  return path.normalize(dirPath).replace(/\\/g, '/');
};


/**
 * @param {String} dirPath is the directory path string
 * @return {string} the suffix of the directory (wrapper for path.basename()).
 */
Util.prototype.basename = function(dirPath) {
  return path.basename(dirPath);
};


/**
 * @param {String} dir is the path string to be verified as a directory.
 * @return {Boolean} true if the dir is a directory.
 */
Util.prototype.isDirectory = function(dir) {
  try {
    var stat = fs.lstatSync(dir);
    return stat.isDirectory();
  } catch(err) {
    return false;
  }
};


/**
 * @param {String} theStr is the string to be elipsed
 * @param {Number} count is the number of letters to remove
 * @return {String} the string with count '.' in the middle.
 */
Util.prototype.ellipse = function(theStr, count) {
  if (!theStr || theStr.length < 1) { return ''; } // return if no string

  var length = theStr.length;

  // return if bad count
  if (!count || count < 4 || length < count) { return theStr; }

  var splitPreSpot = Math.floor((length - count)/2);
  var splitPostSpot = splitPreSpot + count;

  var prefix = theStr.substr(0, splitPreSpot);
  var postfix = theStr.substr(splitPostSpot);
  var newStr = [prefix, '...', postfix].join('');
  
  return newStr;
};
    

/**
 * @param {String} dir is the directory to walk recursively.
 * @param {Function} cb is the callback to call for each file in the dir.
 *   cb(filePath) receives one parameter, the full file path.
 */
Util.prototype.walkDir = function(dir, cb) {
  var fileArray = fs.readdirSync(dir);
  var fileCount = fileArray.length;
  for (var i = 0; i < fileCount; ++i) {
    var fileName = fileArray[i];
    var filePath = dir + '/' + fileName;
    var stat = fs.lstatSync(filePath);
    if (stat.isFile()) {
      cb(filePath);
    } else if (stat.isDirectory()) {
      this.walkDir(filePath, cb);
    }
  }
};


/**
 * @param {String} file the file or directory to remove.
 */
Util.prototype.rmFileOrDir = function(file) {
  fs.removeSync(file);
};


/**
 * @param {String} dirPath is the full directory path.
 * @param {Function} opt_colorFn is an optional chalk fn (e.g. chalk.green)
 * console.logs the directory in the form:
 * filename      size   date
 */
Util.prototype.showDirectory = function(dir, opt_colorFn) {
  var color = opt_colorFn || function(msg) { return msg; };
  var fileArray = fs.readdirSync(dir);
  console.log(color(dir));
  var fileCount = fileArray.length;
  for (var i = 0; i < fileCount; ++i) {
    var fileName = fileArray[i];
    var filePath = dir + '/' + fileName;
    var stat = fs.lstatSync(filePath);
    var fileSize = Math.round(stat.size / 100)/10 + 'KB';
    var date = new Date(stat.mtime);
    date = this.prettyDate(date);
    var spaces1 = Array(40 - fileName.length).fill(' ').join('');
    var spaces2 = Array(10 - fileSize.length).fill(' ').join('');
    var spaces3 = Array(5).fill(' ').join('');
    var msg = [fileName, spaces1, spaces2, fileSize, spaces3, date].join('');
    console.log(color(msg));
  }
};


/**
 * @return {string} a number as a string with a leading '0' if less than ten.
 */
Util.prototype.prefixZero = function(a) {
  return a < 10 ? '0' + a : a;
};


/**
 * Replace %var% with its environment variable equivalent
 * @param {String} instr is a string with possible environment vars
 *    e.g.  'C:/Users/%USERNAME%/someDir'
 * @return {String} with the environment variable replacement.
 */
Util.prototype.templateFix = function(inputStr, opt_delimiter) {
  var delimiter = opt_delimiter || '%';
  var strArray = inputStr.split(delimiter);

  var strArrayCount = strArray.length;
  for (var i = 1; i < strArrayCount; ++i) {
    var currStr = strArray[i];
    var nextStr = strArray[i+1];
    if (nextStr !== undefined) {
      if (process.env[currStr] !== undefined) {
        strArray[i] = process.env[currStr];
      }
      i += 1;
    }
  }
  
  return strArray.join('');
};


/**
 * Runs the exeSync command, then calls the cb with the results.
 * @param {String} cmd is the operating system command (e.g. eslint, ls).
 * @param {Function(stdout, stderr)} cb is the callback function.
 */
Util.prototype.execSync = function(cmd, cb) {
  try {
    var stdout = childProcess.execSync(cmd);
    if (cb) { cb(stdout.toString(), null); }
  } catch(err) {
    if (cb) { cb(null, err.output.toString()); }
  }
};


// export the class
module.exports = Util;
