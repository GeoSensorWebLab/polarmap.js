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

  var layersControl = L.control.layers(projectedTiles, null);
  layersControl.addTo(map);

  // Add shapefiles
  var boundsLimit = L.latLngBounds([45,-180], [90,180]);

  // Options are the same as given to L.GeoJson
  var popPlaces = L.shapefile("ne_110m_populated_places_simple", {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.name);
    },
    // avoid loading features South of 45N. Errors will occur when loading
    // Antarctic data.
    filter: function (featureData, layer) {
      console.log(featureData);
      var coords = featureData.geometry.coordinates;
      return boundsLimit.contains(L.latLng([coords[1], coords[0]]));
    }
  });

  map.addLayer(popPlaces);
  layersControl.addOverlay(popPlaces, "Populated Places");

  var glaciated = L.shapefile("ne_110m_glaciated_areas", {
    // avoid loading features South of 45N. Errors will occur when loading
    // Antarctic data.
    filter: function (featureData, layer) {
      var bbox = featureData.geometry.bbox;
      var llBounds = L.latLngBounds([bbox[1], bbox[0]], [bbox[3], bbox[2]]);
      return boundsLimit.contains(llBounds);
    }
  });

  layersControl.addOverlay(glaciated, "Glaciated Areas");

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

