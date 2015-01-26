# PolarMap.js

A JavaScript library that can re-project Leaflet maps and map features.

PolarMap.js is part of the [Arctic Connect project](http://arcticconnect.org), specifically the [Arctic Web Map](http://webmap.arcticconnect.org/) module.

There are two layers to PolarMap.js: the lower-level Leaflet.PolarMap plugin, and the basic PolarMap library. Each has their advantages depending on the situation. The basic PolarMap library has the default loadout of plugins and configuration for Arctic Connect tiles and services. The Leaflet.PolarMap plugin lets the developer pick and choose their integrations, at the trade-off of more code/configuration.

## Requirements

The Leaflet.PolarMap plugin and PolarMap library both require the following JavaScript libraries to be available:

* [Leaflet 0.7.3](http://leafletjs.com/)
* [Proj4js 2.3.3](https://github.com/proj4js/proj4js)
* [Proj4Leaflet master branch](https://github.com/kartena/Proj4Leaflet/tree/4e445dd765d4e5cfcb156e423c6a0b7b65adf535)

Support for other versions of these libraries are not currently known, use at your own risk of bugs or unexpected behaviour.

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

## Code Reuse

This library contains modified code from the [leaflet-hash](https://github.com/mlevans/leaflet-hash) project. Leaflet-hash is [MIT Licensed](http://opensource.org/licenses/MIT).

## License

See LICENSE file.

