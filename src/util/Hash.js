// Store the base layer, zoom level, and location in URL hash
// Based on code from [leaflet-hash](https://github.com/mlevans/leaflet-hash).
// Leaflet-hash is MIT licensed:
/*
 * Copyright (c) 2013 Michael Lawrence Evans
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

L.PolarMap.Util.Hash = L.Class.extend({
  options: {
    map: null,
    lastHash: null,
    movingMap: false,
    // defer hash change updates every 100ms
    changeDefer: 100,
    changeTimeout: null,
    isListening: false,
    hashChangeInterval: null,
    getBaseLayer: null,
    setBaseLayer: null
  },

  initialize: function (map, options) {
    options = L.setOptions(this, options);

    this.HAS_HASHCHANGE = (function() {
      var doc_mode = window.documentMode;
      return ('onhashchange' in window) &&
        (doc_mode === undefined || doc_mode > 7);
    })();

    this.onHashChange = L.Util.bind(this.onHashChange, this);

    this.map = map;

    // reset the hash
    this.options.lastHash = null;
    this.onHashChange();

    if (!this.options.isListening) {
      this.startListening();
    }
  },

  formatHash: function (map) {
    var hashComponents = [],
        center = map.getCenter(),
        zoom = map.getZoom(),
        precision = Math.max(0, Math.ceil(Math.log(zoom) / Math.LN2));

    if (this.options.getBaseLayer !== null) {
      hashComponents.push(this.options.getBaseLayer());
    }

    hashComponents.push(zoom, center.lat.toFixed(precision), center.lng.toFixed(precision));

    return "#" + hashComponents.join("/");
  },

  onHashChange: function () {
    // throttle calls to update() so that they only happen every
    // `changeDefer` ms
    if (!this.options.changeTimeout) {
      var that = this;
      this.options.changeTimeout = setTimeout(function() {
        that.update();
        that.options.changeTimeout = null;
      }, this.options.changeDefer);
    }
  },

  onMapMove: function () {
    // bail if we're moving the map (updating from a hash),
    // or if the map is not yet loaded

    if (this.options.movingMap || !this.map._loaded) {
      return false;
    }

    var hash = this.formatHash(this.map);

    if (this.options.lastHash != hash) {
      location.replace(hash);
      this.options.lastHash = hash;
    }
  },

  parseHash: function (hash) {
    if(hash.indexOf('#') === 0) {
      hash = hash.substr(1);
    }
    var args = hash.split("/"),
        zoom,
        lat,
        lon;

    if (args.length === 4) {
      var baseLayer = args[0];
      zoom = parseInt(args[1], 10);
      lat = parseFloat(args[2]);
      lon = parseFloat(args[3]);

      if (baseLayer === "" || isNaN(zoom) || isNaN(lat) || isNaN(lon)) {
        return false;
      } else {
        return {
          baseLayer: baseLayer,
          center: new L.LatLng(lat, lon),
          zoom: zoom
        };
      }
    } else if (args.length === 3) {
      zoom = parseInt(args[0], 10);
      lat = parseFloat(args[1]);
      lon = parseFloat(args[2]);

      if (isNaN(zoom) || isNaN(lat) || isNaN(lon)) {
        return false;
      } else {
        return {
          center: new L.LatLng(lat, lon),
          zoom: zoom
        };
      }
    } else {
      return false;
    }
  },

  removeFrom: function (map) {
    if (this.options.changeTimeout) {
      clearTimeout(this.options.changeTimeout);
    }

    if (this.options.isListening) {
      this.stopListening();
    }

    this.map = null;
  },

  startListening: function () {
    this.map.on("moveend", this.onMapMove, this);

    if (this.HAS_HASHCHANGE) {
      L.DomEvent.addListener(window, "hashchange", this.onHashChange);
    } else {
      clearInterval(this.options.hashChangeInterval);
      this.options.hashChangeInterval = setInterval(this.onHashChange, 50);
    }

    this.options.isListening = true;
  },

  stopListening: function () {
    this.map.off("moveend", this.onMapMove, this);

    if (this.HAS_HASHCHANGE) {
      L.DomEvent.removeListener(window, "hashchange", this.onHashChange);
    } else {
      clearInterval(this.options.hashChangeInterval);
    }

    this.options.isListening = false;
  },

  update: function () {
    var hash = location.hash;
    if (hash === this.options.lastHash) {
      return;
    }
    var parsed = this.parseHash(hash);

    if (parsed) {
      this.options.movingMap = true;

      if (parsed.baseLayer !== undefined) {
        this.options.setBaseLayer(parsed.baseLayer);
      }

      this.map.setView(parsed.center, parsed.zoom);

      this.options.movingMap = false;
    } else {
      this.onMapMove(this.map);
    }
  }
});

L.PolarMap.Util.hash = function (map, options) {
  return new L.PolarMap.Util.Hash(map, options);
};
