/*
 * L.PolarMap.layer3573 presets a tile layer with the EPSG:3573 settings.
*/

L.PolarMap.layer3573 = L.PolarMap.laeaTileLayer("//{s}.tiles.arcticconnect.ca/osm_3573/{z}/{x}/{y}.png", {
  name: "ac_3573",
  crs: "EPSG:3573",
  proj4def: "+proj=laea +lat_0=90 +lon_0=-100 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"
});
