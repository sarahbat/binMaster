/**
 * @fileoverview d3map.js creates a single d3map SVG.  
 * 				 
 */

var d3map = {
};

d3map.data = {}; // used when geoJson is loaded up

d3map.loadGeoJSON = function(inputFile){
	queue()
	    .defer(d3.json, './data/us_counties.geojson')// load up the map data
	    .await(ready);

	function ready(error, mapData) {
	    if(error){console.log(error)}
	    console.log(mapData);
		d3map.data = mapData;
	}
}

d3map.loadTopoJSON = function(inputFile){
	queue()
	    .defer(d3.json, inputFile)// load up the map data
	    .await(ready);

	function ready(error, mapData) {
	    if(error){console.log(error)}
	    console.log(mapData);
		d3map.data = mapData;
	}
}


/**
 * Create a DIV to hold the map (if one doesn't already exist to use)
 * @param {string} containerDivID - ID for the parent div.  If not provided, will default to appending DIV to <body> 
 * @param {string} mapDivName - Name to assign to the newly created div.  If not provided, will default to 'myMap'
 * @param {number} opt_height - height for div.  If not provided will try to match parent DIV size, or will match width, or will default to 100px
 * @param {number} opt_width - width for div.  If not provided will try to match parent DIV size, or will match height, or will default to 100px
 */
d3map.makeMapDiv = function(containerDivID, mapDivName, opt_height, opt_width){
	var mapContainer = '#' + containerDivID;
	if (mapDivName === undefined || null){mapDivName = 'myMap';} 

	if (d3.select(mapContainer).empty()){
		console.log('the DIV id listed: ', containerDivID + ' does not exist, appending map DIV to <body> instead');
		mapContainer = 'body';
	}
	var map_div = d3.select(mapContainer)
					.append('div')
					.attr('class', mapDivName)
					.attr('id', mapDivName);

	var height = getHeight(mapContainer);
	var width = getWidth(mapContainer);

	// if div does not have height and width, fill in some defaults (make it a square, or 100px default)
	if (opt_height !== undefined || null){
		map_div.attr('height', opt_height + 'px');
	} else {
		if (height === '0px'){
			if (width !== '0px') { 
				map_div.attr('height', width);
			} else {
				map_div.attr('height', '100px');
			}
		} else{
			map_div.attr('height', height);
		}
	}

	if (opt_width !== undefined || null){
		map_div.attr('width', opt_width + 'px');
	} else {
		if (width === '0px'){
			if (height !== '0px') { 
				map_div.attr('width', height);
			} else {
				map_div.attr('width', '100px');
			}
		} else {
			map_div.attr('width', width);
		}
	}

	return map_div;

	function getWidth(divID){
		if (d3.select(divID).attr('width') !== null || undefined){
			return d3.select(divID).attr('width');
		}
		if (d3.select(divID).style('width' !== null || undefined)){
			return d3.select(divID).style('width');
		}
		return '0px';
	}

	function getHeight(divID){
		if (d3.select(divID).attr('height') !== null || undefined){
			return d3.select(divID).attr('height');
		}
		if (d3.select(divID).style('height') !== null || undefined){
			return d3.select(divID).style('height');
		}
		return '0px';
	}

}

/**
 * Create an SVG canvas to contain the map (if one doesn't already exist to use)
 * @param {array} mapDiv - DIV (e.g., can be retrieved from d3.select(name of your div))
 * @param {array} svgName - id to be assigned to the SVG
 */
d3map.makeMapSVG = function(mapDiv, svgName){
	d3.select('#' + svgName).remove(); // remove any existing svg with same name
	if (svgName === undefined || null) {
		svgName = 'myMapSVG';
	}
	if (mapDiv){
		// SVG will max out to height and width of div
	    var w = mapDiv.attr('width'),
	    	h = mapDiv.attr('height');

	    var width = w.substring(0, w.length - 2),
	        height = h.substring(0, h.length - 2);

		var map_svg = mapDiv.append('svg')
						.attr('width', width)
						.attr('height', height)
						.attr('class', svgName)
						.attr('id', svgName);
	} else {
		console.log(mapDiv + ' does not exist; please input a valid map DIV');
	}

	return map_svg;
}

d3map.drawTopoJSON = function(mapSVG, topoFeatures, featureName, idField){
	var geoFeatures = d3map.topoToGeoJSON(topoFeatures, featureName);
	// SVG will max out to height and width of div
    var w = mapSVG.style('width'),
    	h = mapSVG.style('height');

    var width = w.substring(0, w.length - 2),
        height = h.substring(0, h.length - 2);

	// Get the scale and center parameters from the features.
	var scaleCenter = d3map.calculateScaleCenter(geoFeatures, width, height);
	// console.log(scaleCenter);

	// projection assumed to be albers US (eventually make this dynamic)
    var projection = d3.geo.albersUsa()
        .scale(scaleCenter.scale)
        // .center(scaleCenter.center)
        .translate([(width / 2), height / 2]); // max out size inside div

    var path = d3.geo.path()
        .projection(projection);

    mapSVG.append("g")
        .attr("class", featureName)
        .selectAll("path")
        .data(topojson.feature(topoFeatures, topoFeatures.objects[featureName]).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", featureName)
        .attr("id", function (d) {
            return "_" + d[idField]; // need to make this generic...pass in the ID field?
    });
}

d3map.encodeMap = function(featureName, featureData, binList){
	// update the map to color encode with classed data
    console.log('color encoding map...');

    for (var i = 0; i < featureData.length; i++){
    	d3.select('#_' + featureData[i].id)
    		.style('fill', null)
    		.style('fill', function(){
    			if (featureData[i].bin === NULL_CLASS){return binList.nullBin.getColor();} // -1 = null value
    			if (featureData[i].bin === NODATA_CLASS){return binList.nullBin.getColor();} // -2 = empty cell, temporarily set to no data color
    			return binList.bins[featureData[i].bin].getColor();
    		})
    		.attr('class', function(){
    			if (featureData[i].value === NULL_CLASS){return featureName + ' class_null';}
    			if (featureData[i].value === NODATA_CLASS){return featureName + ' class_noData'}
    			return featureName + ' class_' + featureData[i].value; 
    		})
    }
}



d3map.topoToGeoJSON = function(topoFeatures, featureName){
	var features = topojson.feature(topoFeatures, topoFeatures.objects[featureName]);
	console.log('...creating geoJSON features for ' + featureName);
	return features;
}

d3map.removeSVG = function(svgName){
	svgName.remove();
}


/**
 * Calculate the scale factor and the center coordinates of a GeoJSON
 * FeatureCollection. For the calculation, the height and width of the
 * map container is needed.
 *
 * Thanks to: http://stackoverflow.com/a/17067379/841644
 *
 * @param {object} features - A GeoJSON FeatureCollection object
 *   containing a list of features.
 *
 * @return {object} An object containing the following attributes:
 *   - scale: The calculated scale factor.
 *   - center: A list of two coordinates marking the center.
 */
// TODO: eventually put in a projection option...
d3map.calculateScaleCenter = function(geoFeatures, svgWidth, svgHeight, projection){
    var projection = d3.geo.albersUsa()
        .scale(1);

    var path = d3.geo.path()
        .projection(projection);

  	var bbox_path = path.bounds(geoFeatures),
      	scale = 0.95 / Math.max(
	        (bbox_path[1][0] - bbox_path[0][0]) / svgWidth,
	        (bbox_path[1][1] - bbox_path[0][1]) / svgHeight
	    );
	// Get the bounding box of the features (in map units!) and use it
  	// to calculate the center of the features.
  	var bbox_feature = d3.geo.bounds(geoFeatures),
    	center = [
        	(bbox_feature[1][0] + bbox_feature[0][0]) / 2,
        	(bbox_feature[1][1] + bbox_feature[0][1]) / 2];
  return {
    'scale': scale,
    'center': center
  };
}