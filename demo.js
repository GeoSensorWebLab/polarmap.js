var umap;

function changeBaseMap()
{
	var selected_map_name = $("#selbasemap").val();
	var map_name = selected_map_name.split("@")[0];
	var crs_code = selected_map_name.split("@")[1];

	console.log("change:", map_name);
	console.log("change:", crs_code);

	umap.changeBasemap(map_name, crs_code);

	// umap.clearMarkers();
}

function gotoMap(which) 
{
	if(which==0) {
		var loc_market_mall = [51.084783,-114.155502];
		var l = umap.newMarkerLayer();
		l.addMarker(loc_market_mall, { msg:"Market Mall", popup:true });
		umap.addLayer("mark3", l);
		umap.goto(loc_market_mall, umap._map.init_zoom);
	}
	else if(which==1) {
		var loc_uoc = [51.080126, -114.13380900];
		umap.goto(loc_uoc, umap._map.init_zoom);
	}	
}

function add_layer(lname)
{
	if(lname == "mark1") 
	{	
		// add markers layer at UoC Student Center
		var l = umap.newMarkerLayer();
		l.addMarker([51.079237, -114.13244351], { msg:"mchall" });
		l.addMarker([51.078227, -114.13244351]);
		l.addMarker([51.077229, -114.13244451]);
		l.addMarker([51.078227, -114.13080351]);
		l.addMarker([51.078227, -114.13414351]);
		umap.addLayer(lname, l);
	}
}

function remove_layer(lname)
{
	/* remove the layer named 'mark2' */
	umap.removeLayer(lname);
}

function showhide_toggle(lname)
{
	/* get current status (without the second argument) */
	var flag = umap.showhideLayer(lname);

	/* toggling */
	if(flag)
		umap.showhideLayer(lname, false);
	else
		umap.showhideLayer(lname, true);
}

function test() 
{
	umap = new CMap();

	/* register tile maps for future use. */
	umap.registerTileMaps({ 
			"osm_tile_map@EPSG3857":{ 
				url:"http://{s}.tile.osm.org/{z}/{x}/{y}.png", 
				zoom_range:[0, 18],
				tms_inverse:false,
				center:[51.080126, -114.13380900] },
			"opencyclemap@EPSG3857":{ 
				url:"http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png", 
				zoom_range:[0, 18],
				tms_inverse:false,
				center:[51.080126, -114.13380900] },
			"jotunheimen@EPSG32632":{
				url:"http://thematicmapping.org/playground/terrain/map/tiles/jotunheimen/{z}/{x}/{y}.png",
				zoom_range:[0, 4],
				tms_inverse:false,
				transformation:new L.Transformation(1, -432000, -1, 6850000),
				scale:function(zoom) { return 1 / (234.375 / Math.pow(2, zoom)); },
				center:[61.636, 8.3135] },
			"worldboundariesmap@EPSG4326":{ 
				url:"http://xiaohong.geocens.ca:8080/TileServer/GetTileImage/worldboundariesmap@EPSG4326/{z}/{x}/{y}.png", 
				zoom_range:[0, 4],
				tms_inverse:true,
				center:[51.080126, -114.13380900] },
			"worldboundariesmap@EPSG3573":{
				url:"http://xiaohong.geocens.ca:8080/TileServer/GetTileImage/worldboundariesmap@EPSG3573/{z}/{x}/{y}.png",
				zoom_range:[0, 4],
				// transformation:new L.Transformation(1, -9000000, -1, 9000000),
				tms_inverse:true },				
			"worldboundariesmap@ESRI102016":{
				url:"http://xiaohong.geocens.ca:8080/TileServer/GetTileImage/worldboundariesmap@ESRI102016/{z}/{x}/{y}.png",
				zoom_range:[0, 4],
				// transformation:new L.Transformation(1, -9000000, -1, 9000000),
				tms_inverse:true },				
			"worldboundariesmap@ESRI102018":{
				url:"http://xiaohong.geocens.ca:8080/TileServer/GetTileImage/worldboundariesmap@ESRI102018/{z}/{x}/{y}.png",
				zoom_range:[0, 4],
				// transformation:new L.Transformation(1, -9000000, -1, 9000000),
				tms_inverse:true }
		});

	/* init */
	umap.init({ div_id:"xmap", map_name:"osm_tile_map", crs_code:"EPSG3857", zoom_level:15 });

	var ready_callback = function() 
	{
		// add markers at UoC Student Center
		var l = umap.newMarkerLayer();
		l.addMarker([51.080126, -114.13380900], { msg:"Alec, here?", popup:true });
		l.addMarker([61.636, 8.3135], { msg:"jotunheimen", popup:true });
		umap.addLayer("mark0", l);
	};

	/* after loading required libriries, then call this back */
	umap.onready(ready_callback);

}

