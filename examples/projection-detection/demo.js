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
    name: "Arctic Connect: " + value,
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
    baseLayer: projectedTiles["Arctic Connect: EPSG:3571"]
  });

  // Add a Leaflet layer group. Assumed to be EPSG:3857.
  L.layerGroup([
    L.marker([51.080126, -114.13380900]).bindPopup("University of Calgary"),
    L.marker([90, 100]).bindPopup("North Pole")
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

  // Projection Selection
  var setProjectionForLongitude = function (longitude) {
    var value;
    if (longitude >= -180 && longitude <= -165) {
      value = "EPSG:3571";
    } else if (longitude > -165 && longitude <= -125) {
      value = "EPSG:3572";
    } else if (longitude > -125 && longitude <= -70) {
      value = "EPSG:3573";
    } else if (longitude > -70 && longitude <= -15) {
      value = "EPSG:3574";
    } else if (longitude > -15 && longitude <= 50) {
      value = "EPSG:3575";
    } else if (longitude > 50 && longitude <= 135) {
      value = "EPSG:3576";
    } else {
      value = "EPSG:3571";
    }

    map.loadTileProjection(projectedTiles["Arctic Connect: " + value]);
  };

  // Automatic Location and Projection Detection
  var userLocation = L.circle();

  map.on('locationfound', function (e) {
    console.log("Location info", e);
    userLocation.setLatLng(e.latlng);
    userLocation.setRadius(e.accuracy);

    if (!map.hasLayer(userLocation)) {
      userLocation.addTo(map);
    }

    setProjectionForLongitude(e.longitude);
  });

  map.on('locationerror', function (e) {
    console.warn("Location detection error:", e);
  });

  map.locate();
});

