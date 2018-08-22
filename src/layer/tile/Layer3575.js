/*
 * L.PolarMap.layer3575 presets a tile layer with the EPSG:3575 settings.
*/

L.PolarMap.layer3575 = L.PolarMap.laeaTileLayer("//{s}.tiles.arcticconnect.ca/osm_3575/{z}/{x}/{y}.png", {
  name: "ac_3575",
  crs: "EPSG:3575",
  proj4def: "+proj=laea +lat_0=90 +lon_0=10 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"
});
