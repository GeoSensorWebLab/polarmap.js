var deps = {
  Core: {
    src: ['polarmap.js',
          'layer/tile/TileLayer.js',
          'map/Map.js'
          ],
    desc: 'The core of the library.'
  }
};

if (typeof exports !== 'undefined') {
  exports.deps = deps;
}
