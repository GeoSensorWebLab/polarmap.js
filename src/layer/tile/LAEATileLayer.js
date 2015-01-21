/*
 * L.PolarMap.LAEATileLayer is used for tile layers with a LAEA projection.
 */

var extent = 11000000 + 9036842.762 + 667;

L.PolarMap.LAEATileLayer = L.PolarMap.TileLayer.extend({
  options: {
    minZoom: 0,
    maxZoom: 18,
    tms: false,
    origin: [-extent, extent],
    maxResolution: ((extent - -extent) / 256),
    projectedBounds: L.bounds(L.point(-extent, extent),L.point(extent, -extent)),
    center: [90, 0],
    zoom: 4,
    continuousWorld: false,
    noWrap: true,
    attribution: 'Map &copy; <a href="http://arcticconnect.org">ArcticConnect</a>. Data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }
});

L.PolarMap.laeaTileLayer = function (url, options) {
  return new L.PolarMap.LAEATileLayer(url, options);
};
