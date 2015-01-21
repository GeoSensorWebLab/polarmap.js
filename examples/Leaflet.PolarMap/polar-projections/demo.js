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
  var defaultLayer = projectedTiles["Arctic Connect: EPSG:3575"];
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

