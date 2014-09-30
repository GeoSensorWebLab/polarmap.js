var map;

// Create object to define tile provider settings and transformations. Supports
// all Leaflet TileLayer options.
var projectedTiles = {
  // Example projected tile provider
  /*
  "arctic_connect@EPSG:3573": {
    // name for searching/querying active projected tile provider. Should be
    // unique.
    name: "arctic_connect@EPSG:3573",
    // CRS Code for the tiles
    crs: "EPSG:3573",
    // The Proj4 string for this projection. Alternatively, this string can be
    // defined globally in proj4js.
    proj4def: '+proj=laea +lat_0=90 +lon_0=-100 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    // URL to tiles
    url: "http://tiles.arcticconnect.org/osm_3573/{z}/{x}/{y}.png",
    // max zoom range from tile provider
    minZoom: 0,
    maxZoom: 18,
    // use inverse coordinates if the provider is a TMS. Mapnik is not a TMS.
    tms: false,
    // Origin of the map in projected coordinates
    origin: [-20036842.762, 20036842.762],
    // resolution of smallest zoom level tile. calculation depends on projection
    maxResolution: ((20036842.762 - -20036842.762) / 256),
    // Default centre when this map is loaded
    center: [51.080126, -114.13380900],
    // Default zoom level
    zoom: 15,
    // Map attribution text for tiles and/or data
    attribution: 'Map &copy; <a href="http://arcticconnect.org">ArcticConnect</a>. Data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }
  */

  // Default OSM Provider. Uses EPSG:3857 projection.
  "osm_tile_map@EPSG:3857": {
    name: "osm_tile_map@EPSG:3857",
    crs: "EPSG:3857",
    url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
    minZoom: 0,
    maxZoom: 18,
    tms: false,
    center: [51.080126, -114.13380900],
    zoom: 15,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  },

  // OpenCycleMap, a variant of the OSM stylesheet.
  "opencyclemap@EPSG:3857": {
    name: "opencyclemap@EPSG:3857",
    crs: "EPSG:3857",
    url: "http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png",
    minZoom: 0,
    maxZoom: 18,
    tms: false,
    center: [51.080126, -114.13380900],
    zoom: 15,
    attribution: 'Maps &copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, Data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  },

  // A limited world view that demos EPSG:32632.
  // http://blog.thematicmapping.org/2012/07/using-custom-projections-with-tilecache.html
  "jotunheimen@EPSG:32632": {
    name: "jotunheimen@EPSG:32632",
    crs: "EPSG:32632",
    url: "http://thematicmapping.org/playground/terrain/map/tiles/jotunheimen/{z}/{x}/{y}.png",
    minZoom: 0,
    maxZoom: 4,
    tms: false,
    // (Source on values?)
    origin: [432000, 6850000],
    maxResolution: 234.375,
    bounds: [[61.2383915756, 7.73317925531], [61.7828577605, 8.84834020725]],
    center: [61.636, 8.3135],
    zoom: 1,
    continuousWorld: true,
    attribution: 'Data from <a href="http://www.viewfinderpanoramas.org/dem3.html">Viewfinder Panoramas</a> and <a href="http://www.skogoglandskap.no/kart/arealressurskart/artikler/2007/nedlasting_arealressurser">Norwegian Forest and Landscape Institute</a>'
  },

  "arctic_connect@EPSG:3573": {
    name: "arctic_connect@EPSG:3573",
    crs: "EPSG:3573",
    url: "http://tiles.arcticconnect.org/osm_3573/{z}/{x}/{y}.png",
    minZoom: 0,
    maxZoom: 18,
    tms: false,
    // (Source on values?)
    origin: [-20036842.762, 20036842.762],
    maxResolution: ((20036842.762 - -20036842.762) / 256),
    center: [90, 0],
    zoom: 4,
    continuousWorld: true,
    attribution: 'Map &copy; <a href="http://arcticconnect.org">ArcticConnect</a>. Data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }
};

// Define interface actions as part of Demo object
var Demo = {
  switchMap: function(target) {
    var targetName = $(target).data('name');
    map.loadTileProjection(projectedTiles[targetName]);
  }
};

// Initialization
$(document).ready(function() {
  Autosize.enable();

  var loadDefinitions = function() {
    // Load proj4 definitions from remote JSON file
    return $.ajax({
      url: 'epsg.json',
      dataType: "json"
    }).done(function(result) {
      $.each(result, function (index, value) {
        proj4.defs(index, value);
      });
    });
  };

  var createMap = function() {
      // Load PolarMap
      map = L.PolarMap.map('xmap', {
        tileProjection: projectedTiles["osm_tile_map@EPSG:3857"]
      });

      // Add a Leaflet layer group. Assumed to be EPSG:3857.
      L.layerGroup([
        L.marker([51.080126, -114.13380900]).bindPopup("University of Calgary"),
        L.marker([61.636, 8.3135]).bindPopup("Galdhøpiggen 2469 m"),
        L.marker([90, 100]).bindPopup("North Pole")
      ]).addTo(map);

      return map;
  };

  // Load the definitions, and when finished load the map
  loadDefinitions().done(function() {
    createMap();
  });

  // Bind demo page actions to elements
  $('body').on('click', '[data-action]', function() {
    var action = $(this).data('action');
    if (action in Demo) Demo[action](this);
  });
});

