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
  // Custom extent for our EPSG:3571-3576 tiles
  var extent = 11000000 + 9036842.762 + 667;

  projectedTiles["Arctic Connect: " + value] = L.PolarMap.tileLayer(url, {
    name: "ac_" + (3571 + index),
    crs: value,
    minZoom: 0,
    maxZoom: 18,
    tms: false,
    origin: [-extent, extent],
    maxResolution: ((extent - -extent) / 256),
    projectedBounds: L.bounds(L.point(-extent, extent),L.point(extent, -extent)),
    center: [90,0],
    zoom: 2,
    continuousWorld: false,
    noWrap: true,
    attribution: 'Map &copy; <a href="http://arcticconnect.org">ArcticConnect</a>. Data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  });
});

// Set up next/prev linked list
$.each(projectedTiles, function (layerName, layer) {
  var keys = Object.keys(projectedTiles);
  var index = keys.indexOf(layerName);
  var prev = (index === 0) ? keys.length - 1 : index - 1;
  var next = (index === keys.length - 1) ? 0 : index + 1;

  layer.prev = projectedTiles[keys[prev]];
  layer.next = projectedTiles[keys[next]];
});

// Initialization
$(document).ready(function() {
  Autosize.enable();

  // Load PolarMap
  map = L.PolarMap.map('xmap', {
    baseLayer: projectedTiles["Arctic Connect: EPSG:3571"],
    center: [90, 0],
    zoom: 2
  });

  // Add a Leaflet layer group. Assumed to be EPSG:3857.
  L.layerGroup([
    L.polyline([
      [48.4283327,-123.3649269],
      [53.5343609,-113.5065085],
      [50.4480951,-104.6158181],
      [49.8833343,-97.1666741],
      [43.6529206,-79.3849008],
      [46.8257374,-71.2349114],
      [45.9646491,-66.6437529],
      [46.2333097,-63.1310277],
      [44.6484246,-63.5749724],
      [47.5614849,-52.7125839]
    ], { color: 'red' }),
    L.polyline([
      [60.7206761,-135.0523079],
      [62.4552608,-114.3692511],
      [63.7535819,-68.5028019]
    ], { color: 'orange' }),
    L.circle([69.1170629,-105.0576024], 3000),
    L.polygon([
      [60, -40],
      [60, -20],
      [20, -20],
      [20, -40]
    ]),
    L.polygon([
      [85, -220],
      [85, -200],
      [75, -200],
      [75, -220]
    ])
  ]).addTo(map);

  var layersControl = L.control.layers(projectedTiles, null, {
    collapsed: false
  });
  layersControl.addTo(map);

  // Wire up rotation controls
  var getBaseLayer = function() {
    var foundLayer = null;
    $.each(projectedTiles, function (layerName, layer) {
      if (map.hasLayer(layer)) {
        foundLayer = layer;
      }
    });
    return foundLayer;
  };

  var rotationControls = L.PolarMap.Control.rotation({
    onRotateCW: function() {
      map.loadTileProjection(getBaseLayer().next);
    },

    onRotateCCW: function() {
      map.loadTileProjection(getBaseLayer().prev);
    }
  });
  rotationControls.addTo(map);

  // Set location hash
  var hash = L.PolarMap.Util.hash(map, {
    getBaseLayer: function () {
      return getBaseLayer().options.name;
    },

    setBaseLayer: function (name) {
      $.each(projectedTiles, function (layerName, layer) {
        if (layer.options.name === name) {
          map.loadTileProjection(layer);
        }
      });
    }
  });
});

