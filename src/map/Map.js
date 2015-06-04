// Extend the base Leaflet Map class to handle custom init options for
// projected tiles.
L.PolarMap.Map = L.Map.extend({
  // Default options
  options: {
    /*
    baseLayer: Object
    */

    changingMap: false,
    fadeAnimation: true,
    trackResize: true,
    markerZoomAnimation: true,
    center: L.latLng([90,0]),
    zoom: 1
  },

  initialize: function (id, options) {
    options = L.setOptions(this, options);

    this._initContainer(id);
    this._initLayout();

    // hack for https://github.com/Leaflet/Leaflet/issues/1980
    this._onResize = L.bind(this._onResize, this);

    this._initEvents();

    if (options.maxBounds) {
      this.setMaxBounds(options.maxBounds);
    }

    if (options.center && options.zoom !== undefined) {
      this.setView(L.latLng(options.center), options.zoom, {reset: true});
    }

    this._handlers = [];
    this._layers = {};
    this._zoomBoundLayers = {};

    this.callInitHooks();

    // Update when base layer changed from map control
    this.on('baselayerchange', function (e) {
      this._update(e.layer);
    });

    this._update(options.baseLayer);
  },

  // Public Functions
  loadTileProjection: function (tileLayer) {
    if (this.options.changingMap) {
      return false;
    }

    // Check for existing layer
    if (this._usingTileProjection(tileLayer)) {
      console.log("That tile layer is already active.");
    } else {
      // Drop base tile layers
      this._dropTileLayers();
      this._update(tileLayer);
    }
  },

  // Manually remove layers before destroying map.
  // See https://github.com/Leaflet/Leaflet/issues/2718
  remove: function () {
    for (var i in this._layers) {
      this.removeLayer(this._layers[i]);
		}

    L.Map.prototype.remove.call(this);
    return this;
	},

  // Private Functions
  _defineMapCRS: function (crs, options) {
    var resolutions = [];
    for (var zoom = options.minZoom; zoom <= options.maxZoom; zoom++) {
      resolutions.push(options.maxResolution / Math.pow(2, zoom));
    }

    return new L.Proj.CRS(crs, options.proj4def, {
        origin: options.origin,
        resolutions: resolutions,
        bounds: options.projectedBounds
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
      case "EPSG:3395":
      return L.CRS.EPSG3395;
      case "EPSG:4326":
      return L.CRS.EPSG4326;
      default:
        return this._defineMapCRS(crs, options);
    }
  },

  _update: function (layer) {
    if (this.options.changingMap) {
      return false;
    } else {
      this.options.changingMap = true;

      // preserve map center/zoom level
      var center = this.getCenter(),
          zoom = this.getZoom();

      this._updateCRSAndLayers(layer.options);
      this.addLayer(layer, true);
      this.setView(center, zoom, {reset: true});
      this.setMaxBounds(layer.options.bounds);

      this.options.changingMap = false;
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

  _updateCRSAndLayers: function (layerOptions) {
    this.options.crs = this._setMapCRS(layerOptions.crs, layerOptions);
    this._updateAllLayers(this);
  },

  _usingTileProjection: function (tileLayer) {
    var alreadyActive = false;
    var layers = this._layers;
    for (var layer in layers) {
      if (layers.hasOwnProperty(layer)) {
        alreadyActive = (layers[layer] === tileLayer);
        if (alreadyActive) break;
      }
    }
    return alreadyActive;
  }
});

L.PolarMap.map = function (id, options) {
  return new L.PolarMap.Map(id, options);
};
