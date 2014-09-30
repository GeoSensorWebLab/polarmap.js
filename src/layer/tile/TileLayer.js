/*
 * L.PolarMap.TileLayer is used for tile layers with custom CRS support.
 */

L.PolarMap.TileLayer = L.TileLayer.extend({});

L.PolarMap.tileLayer = function (url, options) {
  return new L.PolarMap.TileLayer(url, options);
};
