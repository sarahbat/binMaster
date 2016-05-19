/**
 * @fileoverview spatialDataMgr.js provides univeral access to topoJSON data
 */
/*jslint nomen:true, plusplus:true, todo:true,  browser:true  */
'use strict';

/**
 * @constructor
 */
binMaster.SpatialDataMgr = function (dataPath) {
  this.data = dataPath ? this.load(dataPath) : null;
  this.featureList = [];
  this.featureCount = {};
  this.key = ""; // key field for joins
};

/**
 * load a data file, collect list and count of geospatial features 
 */
binMaster.SpatialDataMgr.prototype.load = function (dataPath) {
	d3.json(dataPath, function(data){
		this.data = data;
		Object.keys(data.objects).map(function(obj){
			if(data.objects[obj].geometries !== undefined){
				this.featureList.push(obj);
				this.featureCount[obj] = data.objects[obj].geometries.length; // number of objects for each feature type
			}
		}.bind(this));
		this.featureCount = this.featureList.length
	}.bind(this));
};