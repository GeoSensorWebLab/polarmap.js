var deps = {
  Core: {
    src: ['leaflet.polarmap.js',
          'control/Control.Rotation.js',
          'layer/tile/TileLayer.js',
          'util/Hash.js',
          'map/Map.js',
          'polarmap.js'
          ],
    desc: 'The core of the library.'
  }
};

if (typeof exports !== 'undefined') {
  exports.deps = deps;
}
