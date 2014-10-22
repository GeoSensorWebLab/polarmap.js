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

## Examples

See the `examples` directory for more information on how to use PolarMap.js with various Leaflet plugins and features.

## Development

To run a local webserver for testing the app, use the packaged Node http-server:

    $ jake server

It will serve the local directory over HTTP on port 8080.

## Code Reuse

This library contains modified code from the [leaflet-hash](https://github.com/mlevans/leaflet-hash) project. Leaflet-hash is [MIT Licensed](http://opensource.org/licenses/MIT).

## License

See LICENSE file.

