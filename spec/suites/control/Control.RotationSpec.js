describe("Control.Rotation", function () {
  var map, baseLayer;

  beforeEach(function () {
    baseLayer = L.PolarMap.layer3573;

    map = L.PolarMap.map(document.createElement('div'), {
      baseLayer: baseLayer,
      center: [90, 0],
      zoom: 2
    });
  });

  it("can be added to an unloaded map", function () {
    new L.PolarMap.Control.Rotation().addTo(map);
  });
});
