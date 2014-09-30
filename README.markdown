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

See [examples/basic](examples/basic) for an example of how to dynamically switch projection systems with PolarMap.js and Leaflet JS.

## Simple Tile Usage

See [examples/tiles-only](examples/tiles-only) for an example of how to use Leaflet, Proj4JS, and Proj4Leafet to use the Arctic Web Map EPSG 3573 tiles.

Does not include support for projection switching.

## Loading EPSG Definitions

See [examples/epsg-loading](examples/epsg-loading) for loading EPSG proj4 definitions into Proj4js from a remote JSON file. Could easily be modified to load from a web service that returns EPSG proj4 definitions.

## Development

To run a local webserver for testing the app, you can use a one-line Ruby command to run on port 3000:

    $ ruby -rwebrick -e'WEBrick::HTTPServer.new(:Port => 3000, :DocumentRoot => Dir.pwd).start'

There are similar options available for Python and Node.js.

## License

See LICENSE file.

