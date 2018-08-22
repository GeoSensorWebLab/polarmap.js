/*
 * L.PolarMap.layer3576 presets a tile layer with the EPSG:3576 settings.
*/

L.PolarMap.layer3576 = L.PolarMap.laeaTileLayer("//{s}.tiles.arcticconnect.ca/osm_3576/{z}/{x}/{y}.png", {
  name: "ac_3576",
  crs: "EPSG:3576",
  proj4def: "+proj=laea +lat_0=90 +lon_0=90 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"
});
