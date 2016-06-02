/**
 * @fileoverview backUp.js creates a backup (including the dir if needed).
 */
'use strict';

var archiver = require('archiver');
var chalk = require('chalk');
var fs = require('fs-extra');
var Util = require('./util');


/**
 * @param {String} fromDir is the directory we are copying from
 * @param {String} toDir is the directory we are copying to
 * Note: we name the archive file based on the ending of the fromDir string.
 * @constructor
 */
var BackUp = function(projectName, fromDir, toDir) {
  var util = new Util();

  fs.mkdirs(toDir);  // make the backup dir if it does not exist
  
  // create the zip file
  var zipFileName = projectName + '.' + util.createDateString() + '.zip';
  var zipPath = toDir + '/' + zipFileName;
  var output = fs.createWriteStream(zipPath);
  var archive = archiver('zip');
  output.on('close', function () {
    var sizeInKb = Math.round(archive.pointer() /100)/10;
    var msg = ['saved ', zipPath + '  (' + sizeInKb + 'KB)'].join('');
    var overRun = msg.length - 75;
    msg = [util.ellipse(msg, overRun), '\n'].join('');
    console.log(chalk.green.bold(msg));
  });

  archive.on('error', function(err){ throw err; });
  archive.pipe(output);
  archive.directory(fromDir, projectName).finalize();
};


// export the class
module.exports = BackUp;

