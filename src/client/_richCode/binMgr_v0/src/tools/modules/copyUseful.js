/**
 * @fileoverview copyUseful.js copies from useful project useful.min.js and css
 */
'use strict';

var chalk = require('chalk');
var fs = require('fs-extra');
var Util = require('./util');


/**
 * @constructor
 */
var CopyUseful = function(projectPath) {
  this.util = new Util();

  this.copyTo(projectPath, 'client');
  if (this.util.isDirectory(projectPath + '/src/server')) {
    this.copyTo(projectPath, 'server');
  }
};


/**
 * @param {String} projectPath is the path of the project
 * @param {String} clientOrServerStr is either 'client' or 'server'
 * Copy useful.min.* to the project's <toDir>/thirdParty/useful directory.
 */
CopyUseful.prototype.copyTo = function(projectPath, clientOrServerStr) {
  var fromPath = this.util.slash(projectPath + '/../useful/src/release');
  var toPath = this.util.slash(projectPath + '/src/' + 
                               clientOrServerStr + '/thirdParty/useful');

  fs.mkdirs(toPath);  // make the toPath if it does not exist
  fs.copySync(fromPath + '/useful.min.css', toPath + '/useful.min.css');
  fs.copySync(fromPath + '/useful.min.js', toPath + '/useful.min.js');
  this.util.showDirectory(toPath, chalk.green.bold);
  console.log('');
};


// export the class
module.exports = CopyUseful;

