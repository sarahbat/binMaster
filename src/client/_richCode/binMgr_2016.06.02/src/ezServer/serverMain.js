/**
 * @fileoverview main.js is the main entry point for the ez server.
 */
'use strict';
var ezs = require('./ezs');
require('./serverConfig');
require('./serverLogger');
require('./serverServer');
require('fs');
require('path');


/**
 * @constructor
 */
ezs.ServerMain = function () {
  this.logger = new ezs.Logger();
  this.config = new ezs.Config();
  this.overRideConfig();
  
  this.server = new ezs.Server(this.config, this.logger);
};


/**
 * override config webRoot and port with passed in parameters
 */
ezs.ServerMain.prototype.overRideConfig = function() {
  var argCount = process.argv.length;
  for (var i = 2; i < argCount - 1; ++i) {
    var nextArg = i < argCount - 1 && process.argv[i+1].indexOf('-') !== 0 ?
        process.argv[i+1] : null;  // nextArg if not at end and not '-'

    if (nextArg) {
      switch(process.argv[i]) {
      case '-d':
        this.config.package.server.webRoot = nextArg;
        ++i;
        break;

      case '-p':
        this.config.package.server.port  = nextArg;
        ++i;
        break;
      }
    }
  }
};





// start the app
new ezs.ServerMain();

