/*
 * L.PolarMap.layer3573 presets a tile layer with the EPSG:3573 settings.
 */

 var extent = 11000000 + 9036842.762 + 667;

 L.PolarMap.layer3573 = L.PolarMap.tileLayer("http://{s}.tiles.arcticconnect.org/osm_3573/{z}/{x}/{y}.png", {
   name: "ac_3573",
   crs: "EPSG:3573",
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
 });
