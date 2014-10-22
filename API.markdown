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

## Leaflet.PolarMap

API documentation for the plugin portion of PolarMap.js will be added soon.
