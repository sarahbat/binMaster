/**
 * @fileoverview index.js is the build file using node and npm
 */
'use strict';

var chalk = require('chalk');
var packageObj = require('./package.json');
var BackUp = require('./modules/backUp');
var Clean = require('./modules/clean');
var CopyUseful = require('./modules/copyUseful');
var Lint = require('./modules/lint');
var Release = require('./modules/release');
var Util = require('./modules/util');


/**
 * @constructor
 */
var Main = function() {
  this.util = new Util();
  this.projectDir = this.util.templateFix(packageObj.projectVars.projectDir);

  this.projectVersion = packageObj.projectVars.projectVersion;
  this.backupDir = packageObj.projectVars.backupDir;
  this.projectName = this.util.basename(this.projectDir);

  // look at the cmd-line args to see what command to run, default to 'show'
  var cmd = process.argv[2] ? process.argv[2].toLowerCase() : 'show';
  if (typeof this[cmd] === 'function') {
    this[cmd]();
  } else {
    console.log('Error: unknown command:', cmd);
    this.show();
  }
};


/**
 * Clean, then zip the project and copy it to the backupDir
 * Then zip the project from dropBox over to the local file system.
 */
Main.prototype.backup = function() {
  this.clean();
  new BackUp(this.projectName, this.projectDir, this.backupDir);
};


/**
 * Clean the project (remove tilde and #files#).
 */
Main.prototype.clean = function() {
  new Clean(this.projectDir);
};


/**
 * Copy useful.min.js, useful.min.css into <server|client>/thirdParty/useful
 */
Main.prototype.copyuseful = function() {
  new CopyUseful(this.projectDir);
};


/**
 * Run lint on the js and css.
 */
Main.prototype.lint = function() {
  new Lint(this.projectDir);
};


/**
 * Clean, concatinate, minify and copy the files into the release directory.
 */
Main.prototype.release = function() {
  this.clean();
  this.lint();
  new Release(this.projectName, this.projectDir);
};


/**
 * Show the list of commands.
 */
Main.prototype.show = function() {
  var pageWidth = 70;

  // show the project and back up dirs
  var line = chalk.white.bold(Array(pageWidth).fill('-').join(''));
  var msg = [line];
  msg.push('- ' + chalk.green.bold([this.projectName, 
                                    ' v', this.projectVersion].join('')));
  msg.push('- ' + chalk.green(['project dir: ', this.projectDir].join('')));
  msg.push('- ' + chalk.green(['backup dir:  ', this.backupDir].join('')));
  msg.push('-');

  // to figure out how many dots to put between the command and the
  // description, we find the longest command and add three to it.
  var cmdList = packageObj.projectVars.cmdList;
  var cmdCount = cmdList.length;
  var i;
  var maxDots = 0;
  for (i = 0; i < cmdCount; ++i) {
    var cmdLength = cmdList[i][0].length;
    maxDots = cmdLength > maxDots ? cmdLength : maxDots;
  }
  maxDots += 3;

  // show the commands
  for (i = 0; i < cmdCount; ++i) {
    var cmd = cmdList[i][0];
    var description = cmdList[i][1];
    var dotCount = maxDots - cmd.length;
    var dots = Array(dotCount).fill('.').join('');
    msg.push(['- ', cmd, dots, description].join(''));
  }
  msg.push(line);

  console.log(msg.join('\n'));
};


/**
 * Main entry point for the app.
 */
Main.prototype.init = function() {
};

// start the app
new Main();
