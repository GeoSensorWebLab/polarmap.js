# PolarMap.js

A JavaScript library that can re-project Leaflet maps and map features.

PolarMap.js is part of the [Arctic Connect project](http://arcticconnect.ca), specifically the [Arctic Web Map](http://webmap.arcticconnect.ca/) module. We thank [CANARIE](http://www.canarie.ca) for the funding support.

There are two layers to PolarMap.js: the lower-level Leaflet.PolarMap plugin, and the basic PolarMap library. Each has their advantages depending on the situation. The basic PolarMap library has the default loadout of plugins and configuration for Arctic Connect tiles and services. The Leaflet.PolarMap plugin lets the developer pick and choose their integrations, at the trade-off of more code/configuration.

## Requirements

The Leaflet.PolarMap plugin and PolarMap library both require the following JavaScript libraries to be available:

* [Leaflet 0.7.3 to 0.7.7](http://leafletjs.com/)
* [Proj4js 2+](https://github.com/proj4js/proj4js)
* [Proj4Leaflet 0.7.2](https://github.com/kartena/Proj4Leaflet)

Support for other versions of these libraries are not currently known, use at your own risk of bugs or unexpected behaviour.

## Using PolarMap.js

PolarMap.js has a very similar API to Leaflet, so you should feel right at home. First include the stylesheets:

```html
<link rel="stylesheet" href="css/leaflet.css" />
<link rel="stylesheet" href="css/polarmap.css" />
```

Then require the JavaScript:

```html
<script src="js/jquery.js"></script>
<script src="js/leaflet.js"></script>
<script src="js/proj4.js"></script>
<script src="js/proj4leaflet.js"></script>
<script src="js/polarmap-src.js"></script>
```

And then initialize a map the way you would a Leaflet map:

```html
<body onload="init()">
...
<script>
  function init() {
    var map = PolarMap('mapContainer');
  }
</script>
```

And you should be up and running with PolarMap.js. For a more detailed explanation of the API and customization options, please see the [API Documentation](API.markdown).


## Building

It is recommended to download the latest version of PolarMap.js directly from our site. But you can build your own copy from source if you prefer.

To generate a distribution copy of PolarMap.js, you will need to set up the build environment. This requires Node.js. Once Node is installed, you can use NPM to set up the dependencies:

    $ npm install -g jake
    $ npm install

And then generate the build products:

    $ jake build

Two copies of PolarMap.js will be generated in the `dist` directory, one with comments and the other compressed with uglifier-js.

## Examples

See the `examples` directory for more information on how to use PolarMap.js with various Leaflet plugins and features.

## Development

To run a local webserver for testing the app, use the packaged Node http-server:

    $ jake server

It will serve the local directory over HTTP on port 8080.

## Tests

This library has tests for the lower-level plugin that run using Mocha, Sinon, and Expect.js. They can be run in the browser by opening `spec/index.html` or on the command line with `jake test`.

## Compatibility

Different versions of PolarMap.js are available for different versions of Leaflet.

<table>
  <tr><th>Leaflet Version</th>  <th>PolarMap.js Version</th></tr>
  <tr><td>0.7.x</td>            <td>1.1.x</td></tr>
  <tr><td>1.0.x</td>            <td>2.0.x</td></tr>
</table>

A version of PolarMap.js for Leaflet 1.0.x is not yet available.

## Code Reuse

This library contains modified code from the [leaflet-hash](https://github.com/mlevans/leaflet-hash) project. Leaflet-hash is [MIT Licensed](http://opensource.org/licenses/MIT).

## Support

[PolarMap.js](https://github.com/GeoSensorWebLab/polarmap.js) is maintained by James Badger (@openfirmware) and the GeoSensorWeb Lab. If you have issues with the JavaScript library portion, please post an issue on the [PolarMap.js issue tracker](https://github.com/GeoSensorWebLab/polarmap.js/issues).

If you are having issue with the underlying map data, such as map inaccuracies, missing data, or general style comments, then please post an issue on the [Web Map issue tracker](https://github.com/GeoSensorWebLab/awm-styles/issues).

## License

PolarMap.js is released under the BSD 2-Clause license (same as Leaflet).
