var map;

// Create object to define tile provider settings and transformations. Supports
// all Leaflet TileLayer options.
var projectedTiles = {
  "EPSG:3571 Bering Sea": L.PolarMap.layer3571,
  "EPSG:3572 Alaska"    : L.PolarMap.layer3572,
  "EPSG:3573 Canada"    : L.PolarMap.layer3573,
  "EPSG:3574 Atlantic"  : L.PolarMap.layer3574,
  "EPSG:3575 Europe"    : L.PolarMap.layer3575,
  "EPSG:3576 Russia"    : L.PolarMap.layer3576
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
    baseLayer: projectedTiles["EPSG:3571 Bering Sea"],
    center: [90, 0],
    zoom: 2
  });

  // Load markers from JSON file into MarkerCluster.
  map.once('viewreset', function() {
    $.ajax({
      url: 'data.json',
      dataType: "json"
    }).done(function(result) {
      var mLayer = new L.MarkerClusterGroup({
        // the removeOutsideVisibleBounds function does not work with the LAEA
        // projections, so it has been disabled.
        removeOutsideVisibleBounds: false
      });

      $.each(result, function (index, value) {
        mLayer.addLayer(L.marker([value.lat, value.lon], { title: value.display_name }));
      });

      map.addLayer(mLayer);
    });
  });

  var layersControl = L.control.layers(projectedTiles, null);
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
