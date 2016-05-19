/**
 * @fileoverview main.js is the main entry point for the application.
 */
'use strict';

var binMaster = binMaster || {};  // namespace

/**
 * Main entry point for the application.
 */
function main() {
  var b = new binMaster.Bin('cold', 0, 10, 'blue');
  console.log(b.color);
}

// start the app once the HTML dom has loaded
window.addEventListener('load', main);
