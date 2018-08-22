# API

PolarMap.js contains two parts: the lower-level Leaflet.PolarMap plugin and the basic PolarMap library.

This document will explain the capabilities of the Leaflet.PolarMap and PolarMap APIs.

## PolarMap

Initializing a map with the basic PolarMap library is simple. Once the document is loaded (using JQuery or body `onload`), initialize PolarMap with the container element's ID.

```html
    <!-- index.html -->
    <div id='mapContainer'></div>
```

```javascript
    // app.js
    var map = PolarMap('mapContainer');
```

That is all. PolarMap will create a Leaflet map in the element, with the following features enabled:

* Support for Arctic Connect projections EPSG:3571–3576 in a layer switching control
* Controls for rotating the maps through available projections
* Support for permalinks in the browser URL location

Additionally, the `PolarMap` function can accept an options object.

### PolarMap Options

* key: `geosearch`
    * value: `true` or `false`
    * default value: `false`
    * Adds a map control for geospatial location search. Requires the [L.GeoSearch plugin](https://github.com/smeijer/L.GeoSearch) to be included in the page along with a provider before it will work.
* key: `locate`
    * value: `true` or `false`
    * default value: `false`
    * After the map is loaded, the user location will be automatically detected using the W3C GeoLocation API. PolarMap will then automatically switch to the projection closest to the user's longitude.
* key: `permalink`
    * value: `true` or `false`
    * default value: `true`
    * Will save the user's current projection, latitude and longitude, and zoom level in the page's URL. Will automatically update on map pan/zoom or projection change.

These options can only be changed when the `PolarMap` function is first called.

Aside from specifying custom initialization options, the returned object (`map`) exposes methods for map customization.

### PolarMap Methods

* method: `addLayer`
    * arguments: [Leaflet LayerGroup](http://leafletjs.com/reference.html#layergroup), `Options` object
    * `Options` object
        * key: `name`
            * value: Name for layer, if added to layer switch control.
        * key: `switcher`
            * value: `true` or `false`
            * default value: `false` 
            * If true, will display the layer in the PolarMap Layer switching map control.
* method: `getBaseLayer`
    * arguments: none
    * description: Returns the base tile layer currently used on the map

## Leaflet.PolarMap

The base classes in Leaflet.PolarMap:

* `L.PolarMap.Map`
* `L.PolarMap.TileLayer`
* `L.PolarMap.LAEATileLayer`
* `L.PolarMap.Control.Rotation`
* `L.PolarMap.Util.Hash`

### `L.PolarMap.Map`

Very similar to `L.Map`, with a few differences. Instead of initializing with an array for `layers`, pass an `L.PolarMap.TileLayer` to `baseLayer`.

```javascript
    var map = L.PolarMap.map('map_container', {
        baseLayer: L.PolarMap.tileLayer(…)
    });
```

`L.PolarMap.Map` also supports the other [options for L.Map](http://leafletjs.com/reference.html#map-options), aside from `crs` and `layers`. 

#### L.PolarMap.Map.loadTileProjection()

This method can be used to dynamically update the map with a new tile layer, even if the tile layer has a different projection.

```javascript
    map.loadTileProjection(L.PolarMap.tileLayer(…))
```

The object loaded in must be at least an `L.TileLayer` object. It is recommended it also defines the options set in `L.PolarMap.TileLayer` and `L.PolarMap.LAEATileLayer`.

### `L.PolarMap.TileLayer`

A subclass of `L.TileLayer`. Should be initialized with additional options to define the tile layer's CRS and custom parameters. Be sure to define the projection in Proj4JS first.

```javascript

    // See L.TileLayer documentation for URL template
    var url = "http://{s}.tiles.arcticconnect.ca/osm_3571/{z}/{x}/{y}.png";

    // Extent is dependent on projection. The following is used for EPSG:3571 to
    // EPSG:3576.
    var extent = 11000000 + 9036842.762 + 667;

    var tileLayer = L.PolarMap.tileLayer(url, {
        // Name is required for storing the layer id in the permalink if the
        // PolarMap permalink module is active.
        name: "ac_3571",

        // CRS for the tile layer.
        crs: "EPSG:3571",

        // Minimum/maximum zoom level for the tile provider.
        minZoom: 0,
        maxZoom: 18,

        // Is the tile layer provided by a TMS? FYI: OSM is not a TMS.
        tms: false,

        // The tile origin for the projection. LAEA is based on the extent, may
        // vary for other projection systems.
        origin: [-extent, extent],

        // The tile resolution at the lowest zoom level. May vary for other
        // projection systems.
        maxResolution: ((extent - -extent) / 256),

        // The bounds for the tile layer projection. Will cause Leaflet to avoid
        // loading tiles outside these bounds. May vary for other projection
        // systems.
        projectedBounds: L.bounds(L.point(-extent, extent),L.point(extent, -extent)),

        // Whether the World map should be drawn continuously. May not make
        // sense to use for certain projections.
        continuousWorld: false,

        // Whether to wrap tiles. May not make sense to use for certain 
        // projections.
        noWrap: true,

        // Attribution for the tile layer. This is required for certain tile
        // providers.
        attribution: 'Map &copy; <a href="http://arcticconnect.ca">ArcticConnect</a>. Data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',

        // If the tile layer is part of a set of projections that form a 
        // complete circle, then prev/next can link to the next CCW/CW layer in
        // the series when using the L.PolarMap.Control.Rotation module.
        // Can be omitted if the module is not in use.
        prev: L.PolarMap.tileLayer(…),
        next: L.PolarMap.tileLayer(…)
    });
```

The class does not enforce any defaults required for `L.PolarMap.Map`, but may in the future.

### `L.PolarMap.LAEATileLayer`

A subclass of `L.PolarMap.TileLayer`. Has presets for an LAEA projection already set in the options. You will be required to initialize with the URL string and include `name`, `crs`, and optionally `proj4def` in the `options` hash.

A set of LAEA Tile Layer objects have been preset with Arctic Connect tile layers for LAEA projections 3571–3576.

* `L.PolarMap.layer3571`
* `L.PolarMap.layer3572`
* `L.PolarMap.layer3573`
* `L.PolarMap.layer3574`
* `L.PolarMap.layer3575`
* `L.PolarMap.layer3576`

They do not need to be called as a function as they are already initialized.

### `L.PolarMap.Control.Rotation`

A map control that adds two buttons: one to rotate the map clockwise, the other to rotate counter-clockwise. Requires custom glue code to determine which tile layer to switch to on button press.

```javascript
    var tiles = {
        "id_1": L.PolarMap.tileLayer(…),
        "id_2": L.PolarMap.tileLayer(…)
    };

    var map = L.PolarMap.map('map_container', {
        baseLayer: tiles["id_1"]
    });

    var getBaseLayer: function () {
        var foundLayer = null;

        for (var layerName in tiles) {
            if (tiles.hasOwnProperty(layerName)) {
                if (map.hasLayer(tiles[layerName])) {
                    foundLayer = tiles[layerName];
                }
            }
        }
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
```

Assuming a map has been created using a Tile Layer with `prev` and `next` defined, then rotation controls can be used to switch between the tile layers. Note that a way to find the tile layers is required (see the `getBaseLayer` function) that can specifically get the base layer from the `L.PolarMap.Map` object; the map object does not provide such a function at this time.

### `L.PolarMap.Util.Hash`

Very similar to the [Leaflet Hash plugin](https://github.com/mlevans/leaflet-hash), it works identically except provides support for setting the base layer in addition to the latitude/longitude/zoom level. To do this, the `getBaseLayer` and `setBaseLayer` options must be set in the constructor.


```javascript
    var getBaseLayer: function () {
        var foundLayer = null;

        for (var layerName in tiles) {
            if (tiles.hasOwnProperty(layerName)) {
                if (map.hasLayer(tiles[layerName])) {
                    foundLayer = tiles[layerName];
                }
            }
        }
        return foundLayer;
    };

    var setBaseLayer: function (name) {
        for (var layerName in tiles) {
            if (tiles.hasOwnProperty(layerName)) {
                if (tiles[layerName].options.name === name) {
                    map.loadTileProjection(tiles[layerName]);
                }
            }
        }
    };

    L.PolarMap.Util.hash(map, {
        getBaseLayer: function () {
            return getBaseLayer().options.name;
        },

        setBaseLayer: function (name) {
            setBaseLayer(name);
        }
    });
```

Note that glue code for determining the base layer is required.

Once instantiated, the permalink code is activated and will track the map pans and zooms. When loading a URL with the projection, latitude, longitude, and zoom level in the params then these values will override any defaults set for the map object.
