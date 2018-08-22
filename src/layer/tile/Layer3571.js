/*
 * L.PolarMap.layer3571 presets a tile layer with the EPSG:3571 settings.
*/

L.PolarMap.layer3571 = L.PolarMap.laeaTileLayer("//{s}.tiles.arcticconnect.ca/osm_3571/{z}/{x}/{y}.png", {
  name: "ac_3571",
  crs: "EPSG:3571",
  proj4def: "+proj=laea +lat_0=90 +lon_0=180 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"
});
