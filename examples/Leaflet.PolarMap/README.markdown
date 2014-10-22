# Examples

These examples show how to integrate the Leaflet.PolarMap plugin into multiple different scenarios.

## Basic

An example of how to dynamically switch projection systems with Leaflet.PolarMap, from OpenStreetMap to ArcticConnect to Jotunheimen tiles.

## EPSG Loading

An example that loads EPSG proj4 definitions into Proj4js from a remote JSON file. Could easily be modified to load from a web service that returns EPSG proj4 definitions.

## GeoSearch

How to use the [L.GeoSearch plugin](https://github.com/smeijer/L.GeoSearch) to search for locations using [Nominatim](https://wiki.openstreetmap.org/wiki/Nominatim). Alternatively, add other providers from L.GeoSearch to search from ESRI, Google, Bing, or Nokia.

## Layers Switcher

A demo for how to use a Layers Control to switch between available projections, and a custom Rotation control for "rotating" the map by switching the projections.

## Location Hash

This example shows how to use a modified version of the [leaflet-hash plugin](https://github.com/mlevans/leaflet-hash) to save the current view in the URL hash.

## Marker Cluster

See this demo for an integration with the popular [Leaflet MarkerCluster plugin](https://github.com/Leaflet/Leaflet.markercluster). For this example, a set of airports from Nominatim is used. It was retrieved with the following query:

    http://nominatim.openstreetmap.org/search?format=jsonv2&accept-language=en&countrycodes=ca&viewbox=-170,60,-40,90&bounded=1&limit=5000&q=[airport]

Note that the `removeOutsideVisibleBounds` function is disabled for MarkerCluster. By default, it works fine with the EPSG:3857 (web mercator) projection but has issues with the LAEA projections at low zoom levels.

## Polar Projections

A simple example that does not include layer switching controls, but supports defining the projected tile layers manually.

## Projection Detection

This example includes usage of the Leaflet geo-location API, that detects the user location and adds that to the map. After the user's longitude is known, the map then selects the projection that is centred closest to the user's location.

## Shapefiles

[Natural Earth Data](http://www.naturalearthdata.com/downloads/) shapefiles can be added to a map using [leaflet.shapefile](https://github.com/calvinmetcalf/leaflet.shapefile). The demo includes populated place data and glacier data.

## Style Editor

Leaflet.PolarMap is compatible with the [Style Editor plugin](https://github.com/dwilhelm89/Leaflet.StyleEditor), allowing you to edit the appearance of map layers using your browser.

## Vector Layers

This example shows how the custom projections handle Leaflet vector layers (polylines, circles, and polygons). Try switching the projection/base layer to see how the vectors are re-projected.
