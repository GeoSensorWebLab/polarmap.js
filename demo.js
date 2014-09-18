var map;

// Create object to define tile provider settings and transformations.
var mapProviders = {
	"osm_tile_map@EPSG3857": {
		url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
		zoom_range: [0, 18],
		tms_inverse: false,
		center: [51.080126, -114.13380900]
	},
	"opencyclemap@EPSG3857": {
		url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
		zoom_range: [0, 18],
		tms_inverse: false,
		center: [51.080126, -114.13380900]
	},
	"jotunheimen@EPSG32632": {
		url: "http://thematicmapping.org/playground/terrain/map/tiles/jotunheimen/{z}/{x}/{y}.png",
		zoom_range: [0, 4],
		tms_inverse: false,
		transformation: new L.Transformation(1, -432000, -1, 6850000),
		scale: function(zoom) {
			return 1 / (234.375 / Math.pow(2, zoom));
		},
		center: [61.636, 8.3135]
	},
	"worldboundariesmap@EPSG4326": {
		url: "http://xiaohong.geocens.ca:8080/TileServer/GetTileImage/worldboundariesmap@EPSG4326/{z}/{x}/{y}.png",
		zoom_range: [0, 4],
		tms_inverse: true,
		center: [51.080126, -114.13380900]
	},
	"worldboundariesmap@EPSG3573": {
		url: "http://xiaohong.geocens.ca:8080/TileServer/GetTileImage/worldboundariesmap@EPSG3573/{z}/{x}/{y}.png",
		zoom_range: [0, 4],
		tms_inverse: true
	},
	"worldboundariesmap@ESRI102016": {
		url: "http://xiaohong.geocens.ca:8080/TileServer/GetTileImage/worldboundariesmap@ESRI102016/{z}/{x}/{y}.png",
		zoom_range: [0, 4],
		tms_inverse: true
	},
	"worldboundariesmap@ESRI102018": {
		url: "http://xiaohong.geocens.ca:8080/TileServer/GetTileImage/worldboundariesmap@ESRI102018/{z}/{x}/{y}.png",
		zoom_range: [0, 4],
		tms_inverse: true
	}
};

// Define interface actions as part of Demo object
var Demo = {
	add_layer: function(layerName) {
		if (layerName === "mark1")
		{
			// add markers layer at UoC Student Center
			var l = map.newMarkerLayer();
			l.addMarker([51.079237, -114.13244351], { msg: "mchall" });
			l.addMarker([51.078227, -114.13244351]);
			l.addMarker([51.077229, -114.13244451]);
			l.addMarker([51.078227, -114.13080351]);
			l.addMarker([51.078227, -114.13414351]);
			map.addLayer(layerName, l);
		}
	},

	changeBaseMap: function() {
		var selected_map_name = $("#selbasemap").val();
		var map_name = selected_map_name.split("@")[0];
		var crs_code = selected_map_name.split("@")[1];

		console.log("change:", map_name);
		console.log("change:", crs_code);

		map.changeBasemap(map_name, crs_code);
	},

	gotoMap: function(mapIndex) {
		if(mapIndex === 0) {
			var loc_market_mall = [51.084783,-114.155502];
			var l = map.newMarkerLayer();
			l.addMarker(loc_market_mall, { msg: "Market Mall", popup: true });
			map.addLayer("mark3", l);
			map.goto(loc_market_mall, map._map.init_zoom);
		}
		else if(mapIndex === 1) {
			var loc_uoc = [51.080126, -114.13380900];
			map.goto(loc_uoc, map._map.init_zoom);
		}
	},

	remove_layer: function(layerName) {
		map.removeLayer(layerName);
	},

	showhide_toggle: function(layerName) {
		/* get current status (without the second argument) */
		var flag = map.showhideLayer(layerName);

		if (flag) {
			umap.showhideLayer(layerName, false);
		} else {
			umap.showhideLayer(layerName, true);
		}
	}
};


// Initialization
$(document).ready(function() {
	map = new PolarMap();

	map.registerTileMaps(mapProviders);

	map.init({
		div_id: "xmap",
		map_name: "osm_tile_map",
		crs_code: "EPSG3857",
		zoom_level: 15
	});

	map.onready(function() {
		// Add markers at UofC Student Centre
		var markerLayer = map.newMarkerLayer();
		markerLayer.addMarker([51.080126, -114.13380900], { msg: "Alec, here?", popup: true });
		markerLayer.addMarker([61.636, 8.3135], { msg: "jotunheimen", popup: true });
		map.addLayer("markers", markerLayer);
	});
});

