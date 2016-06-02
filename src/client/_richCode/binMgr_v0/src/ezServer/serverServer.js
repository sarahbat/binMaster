/**
 * @fileoverview serverServer.js is the actual HTML server, based on express
 * TODO: write to a file or database
 */
'use strict';
var ezs = require('./ezs');



/**
 * @constructor
 */
ezs.Server = function (config, logger) {
  this.expressModule = require('express');
  this.fsModule = require('fs');
  this.pathModule = require('path');

  this.dirName = process.cwd();
  this.ipList = config.getIpAddressList();
  this.logger = logger;
  this.port = config.getPort();
  this.webRoot = config.getWebRoot();
  this.title = config.getTitle();
  this.version = config.getVersion();

  this.express = this.expressModule();  // set up the express html server
  this.setUpRoutes();  // a route is access to a page or cmd

  // start the html server listening for requests
  this.express.listen(this.port, this.handleServerListening.bind(this));
};


/**
 * A route is a server request for a page or command. This also logs
 * requests and handles any bad requests (e.g. 404). The order of the
 * route handling is important.
 */
ezs.Server.prototype.setUpRoutes = function() {
  // always do this route: log the request
  this.express.use(function(req, res, next) {
    var msg = [req.method, ' received: ', req.url].join('');
    this.logger.log(msg);
    next();
  }.bind(this));

  // map index.htm to index.html
  this.express.get('/index.htm', function(req, res) {
    res.sendFile(this.pathModule.normalize([this.dirName, 
                                            this.webRoot, 
                                            'index.html'].join('/')));
  }.bind(this));

  // route for http requests - get the remote http and write it to foo.html
  this.express.get('/http*', function(req, res) {
    var http = require('http');
    var fs = require('fs');
    var url = req.url.substr(1);
    var dest = this.pathModule.normalize(
                 [this.dirName, this.webRoot, 'foo.html'].join('/'));
    console.log(url, dest);
    var cb = function() {res.sendFile(dest);}.bind(this);

    var file = fs.createWriteStream(dest);
    http.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(cb);  // close() is async, call cb after close completes.
      });
    }).on('error', function(/*err*/) { // Handle errors
      fs.unlink(dest); // delete the file async
      res.status(404).send('http - not found');
    });
  }.bind(this));


  // route: handle static file requests
  this.express.use(this.expressModule.static(this.webRoot));

  // route: display 404 page
  this.express.use(function(req, res) {
    res.status(404).send('404 - not found');
  }.bind(this));

  // route: handle all other errors. This should appear AFTER all other routes
  this.express.use(function(err, req, res /*, next */) {
    console.error(err.stack);
    this.logger.log(err.stack);
    res.status(500).send('500 - server error');
  }.bind(this));
};


/**
 * When the server starts listening, update the subtitle with the ip
 * address and log the start.
 */
ezs.Server.prototype.handleServerListening = function() {
  // create a message that the ezs server has started
  this.logger.log([this.title, ' (v', this.version, ')'].join(''));

  // build a string from the list of ip addresses
  var ipCount = this.ipList.length;
  for (var i = 0; i < ipCount; ++i) {
    this.ipList[i] = [this.ipList[i], ':', this.port].join('');
  }
  var ipString = this.ipList.join(', ');
  this.logger.log(['IP:', ipString].join(' '));

  this.logger.log(['root:', this.webRoot].join(' '));
  this.logger.log('Press ^C^C to stop the server');
};

module.exports = ezs.Server;
