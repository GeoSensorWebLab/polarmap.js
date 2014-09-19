var map;

// Create object to define tile provider settings and transformations.
var projectedTiles = {
  // Example projected tile provider
  /*
  "arctic_connect@EPSG:3573": {
    // name for searching/querying active projected tile provider. Should be
    // unique.
    name: "arctic_connect@EPSG:3573",
    // URL to tiles
    url: "http://tiles.arcticconnect.org/osm_3573/{z}/{x}/{y}.png",
    // max zoom range from tile provider
    minZoom: 0,
    maxZoom: 18,
    // use inverse coordinates if the provider is a TMS. Mapnik is not a TMS.
    tms: false,
    // Apply a transformation for this projection, if applicable. Can be
    // omitted. This example transformation does nothing.
    transformation: new L.Transformation(1, 0, 1, 0),
    // Use a custom scale for the zoom, as the tile sizes are different for
    // this projection. The following is the Leaflet default.
    scale: function(zoom) {
      return Math.pow(2, zoom);
    },
    // The Proj4 string for this projection
    proj4def: '+proj=laea +lat_0=90 +lon_0=-100 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    // origin for this projection
    origin: [-20036842.762, 20036842.762],
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
    url: "http://thematicmapping.org/playground/terrain/map/tiles/jotunheimen/{z}/{x}/{y}.png",
    minZoom: 0,
    maxZoom: 4,
    tms: false,
    // (Source on values?)
    transformation: new L.Transformation(1, -432000, -1, 6850000),
    scale: function(zoom) {
      return 1 / (234.375 / Math.pow(2, zoom));
    },
    center: [61.636, 8.3135],
    zoom: 0,
    attribution: 'Data from <a href="http://www.viewfinderpanoramas.org/dem3.html">Viewfinder Panoramas</a> and <a href="http://www.skogoglandskap.no/kart/arealressurskart/artikler/2007/nedlasting_arealressurser">Norwegian Forest and Landscape Institute</a>'
  }
};

// Initialization
$(document).ready(function() {
  Autosize.enable();

  // Load PolarMap
  // map = L.polarMap('xmap', {
  //   tileProjection: mapProviders["osm_tile_map@EPSG:3857"]
  // });

  // Load Default Leaflet Map
  map = L.map('xmap', {
    center: [51.080126, -114.13380900],
    zoom: 15,
    layers: [
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      })
    ]
  });

  // Add a Leaflet layer group. Assumed to be EPSG:3857.
  L.layerGroup([
    L.marker([51.080126, -114.13380900]).bindPopup("Alec, here?"),
    L.marker([61.636, 8.3135]).bindPopup("jotunheimen")
  ]).addTo(map);

  // Bind demo page actions to elements
  $('body').on('click', '[data-action]', function() {
    var action = $(this).data('action');
    if (action in Demo) Demo[action](this);
  });
});

