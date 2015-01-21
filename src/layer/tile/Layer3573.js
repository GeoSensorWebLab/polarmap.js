/*
 * L.PolarMap.layer3573 presets a tile layer with the EPSG:3573 settings.
*/

L.PolarMap.layer3573 = L.PolarMap.laeaTileLayer("http://{s}.tiles.arcticconnect.org/osm_3573/{z}/{x}/{y}.png", {
  name: "ac_3573",
  crs: "EPSG:3573"
});
