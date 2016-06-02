/**
 * @fileoverview lint.js runs eslint and csslint
 */
'use strict';

var chalk = require('chalk');
var Util = require('./util');


/**
 * @param {String} projectPath is the directory and project name.
 * @constructor
 */
var Lint = function(projectPath) {
  var util = new Util();

  util.execSync('eslint ' + 
                '--color ' +
                '-c ' + projectPath + '/src/tools/.eslintrc.js ' +
                '--ignore-path ' + projectPath + '/src/tools/.eslintignore ' +
                projectPath + '/src', this.handleResults.bind(this));


  util.execSync('csslint ' + 
                '--quiet ' +
                '--ignore=import,box-model,fallback-colors ' +
                '--exclude-list=' + 
                  projectPath + '/src/client/thirdParty/,' +
                  projectPath + '/src/dev/,' +
                  projectPath + '/src/release/,' +
                  projectPath + '/src/server/thirdParty/' +
                  ' ' +
                projectPath + '/src', this.handleResults.bind(this));
};


/**
 * Show the results of lint (eslint and csslint).
 * @param {String} stdout is the information from stdout.
 * @param {String} stderr is the information from stderr.
 */
Lint.prototype.handleResults = function(stdout, stderr) {
  if (stdout) {
    console.log(chalk.red.bold(stdout));
  }

  if (stderr) {
    console.log(stderr);
  }
};


// export the class
module.exports = Lint;

