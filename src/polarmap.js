/* Strings */

var t = {
  attribution: 'Map &copy; <a href="http://arcticconnect.ca">ArcticConnect</a>. Data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  locationDetectionError: "Location detection error: "
};

/* Tile Layer Configuration */

var tiles = {
  "EPSG:3571 Bering Sea": L.PolarMap.layer3571,
  "EPSG:3572 Alaska"    : L.PolarMap.layer3572,
  "EPSG:3573 Canada"    : L.PolarMap.layer3573,
  "EPSG:3574 Atlantic"  : L.PolarMap.layer3574,
  "EPSG:3575 Europe"    : L.PolarMap.layer3575,
  "EPSG:3576 Russia"    : L.PolarMap.layer3576
};

// Return the tile layer that has a key containing `projection`
var getTileLayerForProjection = function(projection) {
  for (var key in tiles) {
    if (tiles.hasOwnProperty(key)) {
      if (key.indexOf(projection) !== -1) {
        return tiles[key];
      }
    }
  }

  return null;
};

// Set up next/prev linked list
var keys = Object.keys(tiles).sort();
for (var i = 0; i < keys.length; i++) {
  var prev = (i === 0) ? 5 : i - 1;
  var next = (i === 5) ? 0 : i + 1;
  var layer = tiles[keys[i]];
  layer.prev = tiles[keys[prev]];
  layer.next = tiles[keys[next]];
}

/* PolarMap Library Function */

window.PolarMap = L.Class.extend({
  options: {
    geosearch: false,
    locate: false,
    permalink: true
  },

  statics: {
    VERSION: L.PolarMap.version
  },

  initialize: function (id, options) {
    var _this = this;
    L.Util.setOptions(this, options);
    this.tiles = tiles;

    /* Controls */

    this.layersControl = L.control.layers(this.tiles, null);

    this.rotationControls = L.PolarMap.Control.rotation({
      onRotateCW: function() {
        _this.map.loadTileProjection(_this.getBaseLayer().next);
      },

      onRotateCCW: function() {
        _this.map.loadTileProjection(_this.getBaseLayer().prev);
      }
    });

    /* Map */

    this.map = L.PolarMap.map(id, {
      baseLayer: this.tiles["EPSG:3573 Canada"],
      center: [90, 0],
      zoom: 4
    });

    this.layersControl.addTo(this.map);
    this.rotationControls.addTo(this.map);

    if (this.options.geosearch) {
      this._initGeosearch();
    }

    if (this.options.locate) {
      this._initLocate();
    }

    if (this.options.permalink) {
      this._initPermalink();
    }
  },

  addLayer: function (layer, options) {
    this.map.addLayer(layer);

    if (typeof(options) !== "undefined" && options.switcher) {
      this.layersControl.addOverlay(layer, options.name);
    }
  },

  getBaseLayer: function () {
    var foundLayer = null;

    for (var layer in this.tiles) {
      if (this.tiles.hasOwnProperty(layer)) {
        if (this.map.hasLayer(this.tiles[layer])) {
          foundLayer = this.tiles[layer];
        }
      }
    }
    return foundLayer;
  },

  _initGeosearch: function () {
    new L.Control.GeoSearch({
      provider: new L.GeoSearch.Provider.OpenStreetMap(),
      showMarker: false
    }).addTo(this.map);
  },

  _initLocate: function () {
    var _this = this;
    var userLocation = L.circle();

    this.map.on('locationfound', function (e) {
      userLocation.setLatLng(e.latlng);
      userLocation.setRadius(e.accuracy);

      if (!_this.map.hasLayer(userLocation)) {
        userLocation.addTo(_this.map);
      }

      _this._setProjectionForLongitude(e.longitude);
    });

    this.map.on('locationerror', function (e) {
      console.warn(t.locationDetectionError, e);
    });

    this.map.locate();
  },

  _initPermalink: function () {
    var _this = this;
    this.hash = L.PolarMap.Util.hash(this.map, {
      getBaseLayer: function () {
        return _this.getBaseLayer().options.name;
      },

      setBaseLayer: function (name) {
        _this._setBaseLayer(name);
      }
    });
  },

  _setBaseLayer: function (name) {
    var _this = this;

    for (var layer in this.tiles) {
      if (this.tiles.hasOwnProperty(layer)) {
        if (this.tiles[layer].options.name === name) {
          _this.map.loadTileProjection(this.tiles[layer]);
        }
      }
    }
  },

  _setProjectionForLongitude: function (longitude) {
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

    this.map.loadTileProjection(getTileLayerForProjection(value));
  }
});

window.polarMap = function (id, options) {
  return new window.PolarMap(id, options);
};
