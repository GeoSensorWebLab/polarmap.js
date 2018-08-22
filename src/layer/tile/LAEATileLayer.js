/*
 * L.PolarMap.LAEATileLayer is used for tile layers with a LAEA projection.
 */

// Extent is half of the WGS84 Ellipsoid equatorial circumference.
var extent = L.Projection.Mercator.R_MAJOR * Math.PI;

L.PolarMap.LAEATileLayer = L.PolarMap.TileLayer.extend({
  options: {
    // name for searching/querying active projected tile provider. Should be
    // unique.
    name: null,
    // CRS Code for the tiles
    crs: null,
    // The Proj4 string for this projection. Alternatively, this string can be
    // defined globally in proj4js.
    // proj4def: null,
    // max zoom range from tile provider
    minZoom: 0,
    maxZoom: 18,
    // use inverse coordinates if the provider is a TMS. Mapnik is not a TMS.
    tms: false,
    // origin of the map in projected coordinates
    origin: [-extent, extent],
    // resolution of smallest zoom level tile. calculation depends on projection
    maxResolution: ((extent - -extent) / 256),
    projectedBounds: L.bounds(L.point(-extent, extent),L.point(extent, -extent)),
    // default centre when this map is loaded
    center: [90, 0],
    // default zoom level
    zoom: 4,
    continuousWorld: false,
    noWrap: true,
    // map attribution text for tiles and/or data
    attribution: 'Map &copy; <a href="http://arcticconnect.ca">ArcticConnect</a>. Data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }
});

L.PolarMap.laeaTileLayer = function (url, options) {
  return new L.PolarMap.LAEATileLayer(url, options);
};
