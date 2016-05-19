/**
 * @fileoverview binMaster.js defines the Bin object.  A Bin consists of:
 *   <ul>
 *     <li>numeric definition of bin extrema (min/max)</li>
 *     <li>encoding definition</li>
 *     <li>label definition(s) with numeric and semantic definition of the
 *         bin class and extrema</li>
 *   </ul>
 *
 *  TODO: add get() methods
 */
'use strict';

var binMaster = binMaster || {};  // namespace
var foo;


/**
 * @param {String} name is the (non-unique) name of the bin
 * @param {Number} minVal is the lowest value for the bin
 * @param {Number} maxVal is the highesr value for the bin
 * @param {String} color is the color for the bin (in hex??)
 *
 * @constructor
 */
binMaster.Bin = function (opt_name, opt_minVal, opt_maxVal, opt_color) {
  // so we can see all the initialized vars for this class
  this.name = '';
  this.min = 0;
  this.max = 0;
  this.color = 'rgb(0,0,0)';  // TODO consider using a css classname

  this.setName(opt_name).
       setMin(opt_minVal).
       setMax(opt_maxVal).
       setColor(opt_color);
};


/**
 * @param{String} name the non-unique name for the bin
 * @return{Object} the this pointer for chaining
 */
binMaster.Bin.prototype.setName = function(name){
  this.name = name || '';
  return this;  // allows chaining
};


/**
 * @param{Number} minVal is the minimum value
 * @return{Object} the this pointer for chaining
 */
binMaster.Bin.prototype.setMin = function(minVal){
  this.minVal = +minVal;  // '+' is fast, implicit conversion to a number
  return this;  // allows chaining
};


/**
 * @param{Number} maxVal is the maximum value.
 * @return{Object} the this pointer for chaining
 */
binMaster.Bin.prototype.setMax = function(maxVal){
  this.maxVal = +maxVal;  // '+' is fast, implicit conversion to a number
  console.log(this.maxVal);
  return this;  // allows chaining
};


/**
 * @param{String} color is the color of the bin.
 * @return{Object} the this pointer for chaining
 */
binMaster.Bin.prototype.setColor = function(color) {
  this.color = color || 'black';
  return this;  // allows chaining
};


/**
 * @return{Number} max - min (assumes max >= min).
 */
binMaster.Bin.prototype.getRange = function(){
  return this.max - this.min;
};

