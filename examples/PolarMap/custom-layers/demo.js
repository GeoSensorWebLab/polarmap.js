// Initialization
$(document).ready(function() {
  Autosize.enable();

  // Load PolarMap
  var map = polarMap('xmap');

  // Add a group of markers, and do not display in layer switcher
  var markerGroup = L.layerGroup([
    L.marker([48.4283327,-123.3649269], { title: 'Victoria' }),
    L.marker([53.5343609,-113.5065085], { title: 'Edmonton' }),
    L.marker([50.4480951,-104.6158181], { title: 'Regina' }),
    L.marker([49.8833343,-97.1666741], { title: 'Winnipeg' }),
    L.marker([43.6529206,-79.3849008], { title: 'Toronto' }),
    L.marker([46.8257374,-71.2349114], { title: 'Quebec' }),
    L.marker([45.9646491,-66.6437529], { title: 'Fredericton' }),
    L.marker([46.2333097,-63.1310277], { title: 'Charlottetown' }),
    L.marker([44.6484246,-63.5749724], { title: 'Halifax' }),
    L.marker([47.5614849,-52.7125839], { title: 'St. John\'s' })
  ]);
  map.addLayer(markerGroup);

  // Add a polygon, and display in layer switcher with name
  var polygonGroup = L.layerGroup([
    L.polygon([
      [60, -40],
      [60, -20],
      [20, -20],
      [20, -40]
    ])
  ]);
  map.addLayer(polygonGroup, {
    name: 'Polygon',
    switcher: true
  });
});
