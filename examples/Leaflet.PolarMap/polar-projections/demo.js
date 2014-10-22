var map;

var projections = [
  "EPSG:3571",
  "EPSG:3572",
  "EPSG:3573",
  "EPSG:3574",
  "EPSG:3575",
  "EPSG:3576"
  ];

// Globally define projections for Proj4js. If not defined here, then they must
// be defined in tile provider definitions below.
proj4.defs([
  ["EPSG:3571","+proj=laea +lat_0=90 +lon_0=180 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"],
  ["EPSG:3572","+proj=laea +lat_0=90 +lon_0=-150 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"],
  ["EPSG:3573","+proj=laea +lat_0=90 +lon_0=-100 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"],
  ["EPSG:3574","+proj=laea +lat_0=90 +lon_0=-40 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"],
  ["EPSG:3575","+proj=laea +lat_0=90 +lon_0=10 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"],
  ["EPSG:3576","+proj=laea +lat_0=90 +lon_0=90 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"]
]);

// Create object to define tile provider settings and transformations. Supports
// all Leaflet TileLayer options.
var projectedTiles = {};

$.each(projections, function (index, value) {
  var url = "http://{s}.tiles.arcticconnect.org/osm_" + (3571 + index) + "/{z}/{x}/{y}.png";
  var extent = 11000000 + 9036842.762 + 667;

  projectedTiles["arctic_connect@" + value] = L.PolarMap.tileLayer(url, {
    name: "arctic_connect@" + value,
    crs: value,
    minZoom: 0,
    maxZoom: 18,
    tms: false,
    origin: [-extent, extent],
    maxResolution: ((extent - -extent) / 256),
    projectedBounds: L.bounds(L.point(-extent, extent),L.point(extent, -extent)),
    center: [90,0],
    zoom: 4,
    continuousWorld: false,
    noWrap: true,
    attribution: 'Map &copy; <a href="http://arcticconnect.org">ArcticConnect</a>. Data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  });
});

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

  // Load PolarMap
  var defaultLayer = projectedTiles["arctic_connect@EPSG:3575"];
  map = L.PolarMap.map('xmap', {
    baseLayer: defaultLayer,
    center: defaultLayer.options.center,
    zoom: defaultLayer.options.zoom
  });

  // Add a Leaflet layer group. Assumed to be EPSG:3857.
  L.layerGroup([
    L.marker([51.080126, -114.13380900]).bindPopup("University of Calgary"),
    L.marker([90, 100]).bindPopup("North Pole")
  ]).addTo(map);

  // Bind demo page actions to elements
  $('body').on('click', '[data-action]', function() {
    var action = $(this).data('action');
    if (action in Demo) Demo[action](this);
  });
});

