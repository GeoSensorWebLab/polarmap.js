# PolarMap.js

A JavaScript library that can re-project Leaflet maps and map features.

## Building

It is recommended to download the latest version of PolarMap.js directly from our site. But you can build your own copy from source if you prefer.

To generate a distribution copy of PolarMap.js, you will need to set up the build environment. This requires Node.js. Once Node is installed, you can use NPM to set up the dependencies:

    $ npm install
    $ npm install -g jake

And then generate the build products:

    $ jake build

two copies of PolarMap.js will be generated in the `dist` directory, one with comments and the other compressed with uglifier-js.

## Projection Switching

See examples/basic for an example of how to dynamically switch projection systems with PolarMap.js and Leaflet JS.

## Simple Tile Usage

See examples/tiles-only for an example of how to use Leaflet, Proj4JS, and Proj4Leafet to use the Arctic Web Map EPSG 3573 tiles.

Does not include support for projection switching.

## Loading EPSG Definitions

See examples/epsg-loading for loading EPSG proj4 definitions into Proj4js from a remote JSON file. Could easily be modified to load from a web service that returns EPSG proj4 definitions.

# Tile Switching and Rotation

See examples/layers-switcher for how to use a Layers Control to switch between available projections, and a custom Rotation control for "rotating" the map by switching the projections.

# Location Saved in URL Hash

See examples/location-hash for how to use the [leaflet-hash plugin](https://github.com/mlevans/leaflet-hash) to save the current view in the URL hash.

# GeoSearch

See examples/geosearch for how to use the [L.GeoSearch plugin](https://github.com/smeijer/L.GeoSearch) to search for locations using [Nominatim](https://wiki.openstreetmap.org/wiki/Nominatim). Alternatively, add other providers from L.GeoSearch to search from ESRI, Google, Bing, or Nokia.

# Vector Layers

See examples/vector-layers for an example of how the projections handle Leaflet vector layers (polylines, circles, and polygons). Try switching the projection/base layer to see how the vectors are re-projected.

# Marker Cluster

See examples/marker-cluster for an integration with the popular [Leaflet MarkerCluster plugin](https://github.com/Leaflet/Leaflet.markercluster). For this example, a set of airports from Nominatim is used. It was retrieved with the following query:

    http://nominatim.openstreetmap.org/search?format=jsonv2&accept-language=en&countrycodes=ca&viewbox=-170,60,-40,90&bounded=1&limit=5000&q=[airport]

Note that the `removeOutsideVisibleBounds` function is disabled for MarkerCluster. By default, it works fine with the EPSG:3857 (web mercator) projection but has issues with the LAEA projections at low zoom levels.

## Development

To run a local webserver for testing the app, use the packaged Node http-server:

    $ jake server

It will serve the local directory over HTTP on port 8080.

## Code Reuse

This library contains modified code from the [leaflet-hash](https://github.com/mlevans/leaflet-hash) project. Leaflet-hash is [MIT Licensed](http://opensource.org/licenses/MIT).

## License

See LICENSE file.

