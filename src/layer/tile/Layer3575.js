/*
 * L.PolarMap.layer3575 presets a tile layer with the EPSG:3575 settings.
*/

L.PolarMap.layer3575 = L.PolarMap.laeaTileLayer("http://{s}.tiles.arcticconnect.org/osm_3575/{z}/{x}/{y}.png", {
  name: "ac_3575",
  crs: "EPSG:3575"
});
