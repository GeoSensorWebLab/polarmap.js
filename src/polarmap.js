// Extend the base Leaflet Map class to handle custom init options for
// projected tiles.
L.PolarMap = L.Map.extend({
  // Default options
  options: {
    /*
    tileProjection: Object
    */

    fadeAnimation: true,
    trackResize: true,
    markerZoomAnimation: true
  },

  initialize: function (id, options) {
    options = L.setOptions(this, options);
    var tileOptions = options.tileProjection;

    this._initContainer(id);
    this._initLayout();

    // hack for https://github.com/Leaflet/Leaflet/issues/1980
    this._onResize = L.bind(this._onResize, this);

    this._initEvents();

    if (options.maxBounds) {
      this.setMaxBounds(options.maxBounds);
    }

    if (tileOptions.zoom !== undefined) {
      this._zoom = this._limitZoom(tileOptions.zoom);
    }

    this._handlers = [];
    this._layers = {};
    this._zoomBoundLayers = {};

    this.callInitHooks();

    this.options.crs = this._setMapCRS(tileOptions.crs, tileOptions);

    this.addLayer(L.tileLayer(tileOptions.url, tileOptions), true);

    if (tileOptions.center && tileOptions.zoom !== undefined) {
      this.setView(L.latLng(tileOptions.center), tileOptions.zoom, {
        reset: true
      });
    }
    this.setMaxBounds(tileOptions.bounds);
  },

  // Public Functions
  loadTileProjection: function (tileOptions) {
    // Check for existing layer
    if (this._usingTileProjection(tileOptions)) {
      console.log("That tile layer is already active.");
    } else {
      // Drop base tile layers
      this._dropTileLayers();

      // Change Map CRS
      this.options.crs = this._setMapCRS(tileOptions.crs, tileOptions);

      // Reproject other layers
      this._updateAllLayers(this);

      // Add new base layer
      var baseLayer = L.tileLayer(tileOptions.url, tileOptions);
      this.addLayer(baseLayer, true);

      // Update the View
      if (tileOptions.center && tileOptions.zoom !== undefined) {
        this.setView(L.latLng(tileOptions.center), tileOptions.zoom, {
          reset: true
        });
      }
      this.setMaxBounds(tileOptions.bounds);
    }
  },

  // Private Functions
  _defineMapCRS: function (crs, options) {
    var resolutions = [];
    for (var zoom = options.minZoom; zoom <= options.maxZoom; zoom++) {
      resolutions.push(options.maxResolution / Math.pow(2, zoom));
    };

    return new L.Proj.CRS(crs, options.proj4def, {
        origin: options.origin,
        resolutions: resolutions
    });
  },

  _dropTileLayers: function () {
    var map = this;

    map.eachLayer(function (layer) {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });
  },

  // Use default CRS classes for common codes, fallback to custom for all other
  // codes.
  _setMapCRS: function (crs, options) {
    switch(crs) {
      case "EPSG:3857":
      return L.CRS.EPSG3857;
      break;
      case "EPSG:3395":
      return L.CRS.EPSG3395;
      break;
      case "EPSG:4326":
      return L.CRS.EPSG4326;
      break;
      default:
        return this._defineMapCRS(crs, options);
      break;
    }
  },

  // This recurses through all the map's layers to update layer positions after
  // their positions moved.
  _updateAllLayers: function (group) {
    var map = this;

    if (group.eachLayer) {
      group.eachLayer(function (layer) {
        map._updateAllLayers(layer);
      });
    } else {
      if (group.redraw) {
        group.redraw();
      } else if (group.update) {
        group.update();
      } else {
        console.log("Don't know how to update", group);
      }
    }
  },

  _usingTileProjection: function (tileOptions) {
    var alreadyActive = false;
    var layers = this._layers;
    for (var layer in layers) {
      if (layers.hasOwnProperty(layer)) {
        alreadyActive = (layers[layer]._url && (layers[layer]._url === tileOptions.url));
        if (alreadyActive) break;
      }
    }
    return alreadyActive;
  }
});

L.polarMap = function (id, options) {
  return new L.PolarMap(id, options);
};
