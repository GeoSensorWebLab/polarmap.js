# PolarMap.js

A JavaScript library that can re-project Leaflet maps and map features.

## Projection Switching

See [examples/leaflet-plugin](examples/leaflet-plugin) for an example of how to dynamically switch projection systems with PolarMap.js and Leaflet JS.

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

