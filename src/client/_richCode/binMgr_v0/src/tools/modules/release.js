/**
 * @fileoverview release.js creates the release version of the project.
 */
'use strict';

var chalk = require('chalk');
var fs = require('fs-extra');
var path = require('path');
var Util = require('./util');


/**
 * @param {String} projectPath is the directory and project name.
 * @constructor
 */
var Release = function(projectName, projectPath) {
  var cmd;
  this.util = new Util();

  this.projectName = projectName;
  this.srcDir = this.util.slash(path.join(projectPath, 'src/client'));
  this.releaseDir = this.util.slash(path.join(projectPath, 'src/release'));

  fs.mkdirs(this.releaseDir);  // make the backup dir if it does not exist

  cmd = 'find ' + this.srcDir + ' -name "*.js" -type f';
  this.util.execSync(cmd, this.handleJsFindResults.bind(this));

  cmd = 'find ' + this.srcDir + ' -name "*.css" -type f';
  this.util.execSync(cmd, this.handleCssFindResults.bind(this));

  // show the results
  console.log('');
  this.util.showDirectory(this.releaseDir, chalk.green.bold);
};


/**
 * Take the string of results and
 *   convert it to an array of files and process
 *   remove the files that are not part of the release
 *   take the results and concat, uglify, and minimize to one file
 */
Release.prototype.handleJsFindResults = function(resultsString) {
  var cmd;
  var fileList = resultsString.split('\n');

  var namespaceFilePath =
      this.util.slash(path.join(this.srcDir, this.projectName + '.js'));

  // remove all files in the apps/ directory
  var count = fileList.length;
  for (var i = 0; i < count; ++i) {
    if (fileList[i].indexOf('apps/') > -1) {
      fileList[i] = '';
    }

    // remove the namespace file, since we will explicitly put it first
    if (fileList[i].indexOf(namespaceFilePath) > -1) {
      fileList[i] = '';
    }
  }

  // explicitly put the projectName.js at the front of the list for concat
  var fileStr = [namespaceFilePath, fileList.join(' ')].join(' ');

  var filename = this.projectName + '.min.js';
  var releaseFilePath = this.util.slash(path.join(this.releaseDir, filename));

  // cat, uglify, minify the code
  cmd = 'cat ' + fileStr + ' > ' + releaseFilePath;
  this.util.execSync(cmd);

  cmd = 'uglifyjs ' + releaseFilePath +
        ' --compress --mangle --output ' + releaseFilePath;
  this.util.execSync(cmd);
};


/**
 * Take the string of results and
 *   convert it to an array of files and process
 *   remove the files that are not part of the release
 *   copy the css files over to the release directory
 */
Release.prototype.handleCssFindResults = function(resultsString) {
  var fileList = resultsString.split('\n');

  // do not copy files in the apps/ directory
  var count = fileList.length;
  for (var i = 0; i < count; ++i) {
    if (fileList[i].length > 0 && fileList[i].indexOf('apps/') === -1) {
      var filename = this.util.basename(fileList[i]);
      filename = filename.split('.css').join('.min.css');  // change to min.css
      var toFilePath = this.util.slash(path.join(this.releaseDir, filename));
      fs.copySync(fileList[i], toFilePath);
    }
  }
};


// export the class
module.exports = Release;
