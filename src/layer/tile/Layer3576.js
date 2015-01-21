/*
 * L.PolarMap.layer3576 presets a tile layer with the EPSG:3576 settings.
*/

L.PolarMap.layer3576 = L.PolarMap.laeaTileLayer("http://{s}.tiles.arcticconnect.org/osm_3576/{z}/{x}/{y}.png", {
  name: "ac_3576",
  crs: "EPSG:3576"
});
