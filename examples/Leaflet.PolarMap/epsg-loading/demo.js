var map;

// Create object to define tile provider settings and transformations.
var projectedTiles = {
  // Default OSM Provider. Uses EPSG:3857 projection.
  "osm_tile_map@EPSG:3857":
    L.PolarMap.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    name: "osm_tile_map@EPSG:3857",
    crs: "EPSG:3857",
    minZoom: 0,
    maxZoom: 18,
    tms: false,
    center: [51.080126, -114.13380900],
    zoom: 15,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }),

  // OpenCycleMap, a variant of the OSM stylesheet.
  "opencyclemap@EPSG:3857":
    L.PolarMap.tileLayer("http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png", {
    name: "opencyclemap@EPSG:3857",
    crs: "EPSG:3857",
    minZoom: 0,
    maxZoom: 18,
    tms: false,
    center: [51.080126, -114.13380900],
    zoom: 15,
    attribution: 'Maps &copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, Data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }),

  // A limited world view that demos EPSG:32632.
  // http://blog.thematicmapping.org/2012/07/using-custom-projections-with-tilecache.html
  "jotunheimen@EPSG:32632":
    L.PolarMap.tileLayer("http://thematicmapping.org/playground/terrain/map/tiles/jotunheimen/{z}/{x}/{y}.png", {
    name: "jotunheimen@EPSG:32632",
    crs: "EPSG:32632",
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
  }),

  "arctic_connect@EPSG:3573":
    L.PolarMap.layer3573
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
      var defaultLayer = projectedTiles["osm_tile_map@EPSG:3857"];
      map = L.PolarMap.map('xmap', {
        baseLayer: defaultLayer,
        center: defaultLayer.options.center,
        zoom: defaultLayer.options.zoom
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

