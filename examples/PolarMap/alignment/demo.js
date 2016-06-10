// Initialization
var locations = [
  { coordinates: [47.4815233, 8.4006206], href: "http://www.openstreetmap.org/node/1708613061" },
  { coordinates: [62.4538585, -114.3718282], href: "http://www.openstreetmap.org/node/3151501272" },
  { coordinates: [62.7810841, 40.3958394], href: "http://www.openstreetmap.org/node/1378696917" },
  { coordinates: [69.6466147, -141.0006022], href: "http://www.openstreetmap.org/node/244247661" },
  { coordinates: [64.153367, -21.9922], href: "http://www.openstreetmap.org/node/1565448715" },
  { coordinates: [51.5464344, -0.3257602], href: "http://www.openstreetmap.org/node/31472679" },
  { coordinates: [60.1720912, 24.9388441], href: "http://www.openstreetmap.org/node/1277737569" },
  { coordinates: [70.7880648, -53.654276], href: "http://www.openstreetmap.org/node/3665355722" },
  { coordinates: [72.3955761, 126.657488], href: "http://www.openstreetmap.org/node/1363089097" }
];

$(document).ready(function() {
  // Fill Select element
  $.each(locations, function(index, location) {
    var $element = $("<option></option>")
      .val(index)
      .text(location.coordinates.toString());
    $("#locations-list").append($element);
  });

  // Setup Maps
  var osmMap = L.map("osm");
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(osmMap);

  var pMap = polarMap("polar");

  osmMap.setView([51, -114], 2);
  pMap.map.setView([51, -114], 2);

  // Have to create a separate marker for each map else weirdness happens
  function addToMap(location, map) {
    var marker = L.marker(location.coordinates);
    marker.addTo(map);
  }

  $.each(locations, function(index, location) {
    addToMap(location, osmMap);
    addToMap(location, pMap);
  });

  // Sync maps
  var syncInProgress = false;

  osmMap.on("moveend", function() {
    if (!syncInProgress) {
      syncInProgress = true;
      pMap.map.setView(osmMap.getCenter(), osmMap.getZoom());
      setTimeout(function() { syncInProgress = false; }, 1000);
    }
  });

  pMap.map.on("moveend", function() {
    if (!syncInProgress) {
      syncInProgress = true;
      osmMap.setView(pMap.map.getCenter(), pMap.map.getZoom());
      setTimeout(function() { syncInProgress = false; }, 1000);
    }
  });

  // Select change event
  $("#locations-list").on("change", function() {
    var index = $(this).val();
    var location = locations[index];
    if (location) {
      osmMap.setView(L.latLng(location.coordinates), 18);
      pMap.map.setView(L.latLng(location.coordinates), 18);
    }
  });
});
