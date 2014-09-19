var map;

// Create object to define tile provider settings and transformations.
var mapProviders = {
	// Default OSM Provider. Uses EPSG:3857 projection.
	"osm_tile_map@EPSG3857": {
		url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
		// max zoom range from tile provider
		zoom_range: [0, 18],
		// use inverse coordinates if the provider is a TMS. Mapnik is not a TMS.
		tms_inverse: false,
		// Default centre when this map is loaded
		center: [51.080126, -114.13380900],
		// Map attribution text for tiles and/or data
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	},

	// OpenCycleMap, a variant of the OSM stylesheet.
	"opencyclemap@EPSG3857": {
		url: "http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png",
		zoom_range: [0, 18],
		tms_inverse: false,
		center: [51.080126, -114.13380900],
		attribution: 'Maps &copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, Data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	},

	// A limited world view that demos EPSG:32632.
	// http://blog.thematicmapping.org/2012/07/using-custom-projections-with-tilecache.html
	"jotunheimen@EPSG32632": {
		url: "http://thematicmapping.org/playground/terrain/map/tiles/jotunheimen/{z}/{x}/{y}.png",
		zoom_range: [0, 4],
		tms_inverse: false,
		// Apply a transformation for this projection. (Source on values?)
		transformation: new L.Transformation(1, -432000, -1, 6850000),
		// Use a custom scale for the zoom, as the tile sizes are different for
		// this projection. (Source for 234.375?)
		scale: function(zoom) {
			return 1 / (234.375 / Math.pow(2, zoom));
		},
		center: [61.636, 8.3135],
		attribution: 'Data from <a href="http://www.viewfinderpanoramas.org/dem3.html">Viewfinder Panoramas</a> and <a href="http://www.skogoglandskap.no/kart/arealressurskart/artikler/2007/nedlasting_arealressurser">Norwegian Forest and Landscape Institute</a>'
	}
};

// Define interface actions as part of Demo object
var Demo = {
	addDemoLayer: function() {
		var layer = map.newMarkerLayer();
		layer.addMarker([51.079237, -114.13244351], { msg: "MacEwan Student Centre" });
		layer.addMarker([51.078227, -114.13244351]);
		layer.addMarker([51.077229, -114.13244451]);
		layer.addMarker([51.078227, -114.13080351]);
		layer.addMarker([51.078227, -114.13414351]);
		map.addLayer("marker1", layer);
	},

	changeBaseMap: function() {
		var selected_map_name = $("#selbasemap").val();
		var map_name = selected_map_name.split("@")[0];
		var crs_code = selected_map_name.split("@")[1];

		console.log("change:", map_name);
		console.log("change:", crs_code);

		map.changeBasemap(map_name, crs_code);
	},

	gotoLocation: function(target) {
		var addMarker = function (location, message) {
			var layer = map.newMarkerLayer();
			layer.addMarker(location, {
				msg: message,
				popup: true
			});
			map.addLayer("aLayer", layer);
			map.goto(location, map._map.init_zoom);
		};

		var targetName = $(target).data('name');
		switch(targetName) {
			case 'Market Mall':
				addMarker([51.084783, -114.155502], "Market Mall");
			break;
			case 'UofC':
				addMarker([51.080126, -114.13380900], "UofC");
			break;
		};
	},

	removeDemoLayer: function() {
		map.removeLayer("marker1");
	},

	toggleDemoLayer: function() {
		map.showhideLayer("marker1", !map.showhideLayer("marker1"));
	}
};


// Initialization
$(document).ready(function() {
	Autosize.enable();

	map = new PolarMap.Map();

	map.registerTileMaps(mapProviders);

	map.init({
		div_id: "xmap",
		map_name: "osm_tile_map",
		crs_code: "EPSG3857",
		zoom_level: 15
	});

	map.onready(function() {
		var markerLayer = map.newMarkerLayer();
		markerLayer.addMarker([51.080126, -114.13380900], { msg: "Alec, here?", popup: true });
		markerLayer.addMarker([61.636, 8.3135], { msg: "jotunheimen", popup: true });
		map.addLayer("markers", markerLayer);
	});

	// Bind actions to elements
	$('body').on('click', '[data-action]', function() {
	  var action = $(this).data('action');
	  if (action in Demo) Demo[action](this);
	});
});

