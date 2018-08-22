/*
 * L.PolarMap.layer3572 presets a tile layer with the EPSG:3572 settings.
*/

L.PolarMap.layer3572 = L.PolarMap.laeaTileLayer("//{s}.tiles.arcticconnect.ca/osm_3572/{z}/{x}/{y}.png", {
  name: "ac_3572",
  crs: "EPSG:3572",
  proj4def: "+proj=laea +lat_0=90 +lon_0=-150 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"
});
