var map;

// Create object to define tile provider settings and transformations. Supports
// all Leaflet TileLayer options.
var projectedTiles = {
  "Arctic Connect: EPSG:3571": L.PolarMap.layer3571,
  "Arctic Connect: EPSG:3572": L.PolarMap.layer3572,
  "Arctic Connect: EPSG:3573": L.PolarMap.layer3573,
  "Arctic Connect: EPSG:3574": L.PolarMap.layer3574,
  "Arctic Connect: EPSG:3575": L.PolarMap.layer3575,
  "Arctic Connect: EPSG:3576": L.PolarMap.layer3576
};

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

