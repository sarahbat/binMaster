/**
 * @fileoverview clean.js removes tilde and # files left by emacs.
 */
'use strict';

var chalk = require('chalk');
var Util = require('./util');

/**
 * @param {string} dirName is the name of the directory to clean.
 * @constructor
 */
var Clean = function(dirName) {
  var util = new Util();

  util.walkDir(dirName, function(filePath) {
    var fileName = util.basename(filePath);

    if ((fileName.lastIndexOf('~') === fileName.length - 1) ||
        (fileName.indexOf('#') === 0 && 
         fileName.lastIndexOf('#') === fileName.length - 1)) {
      console.log(chalk.green.bold('removing ' + fileName));
      util.rmFileOrDir(filePath);
    }
  });
};

// export the class
module.exports = Clean;
