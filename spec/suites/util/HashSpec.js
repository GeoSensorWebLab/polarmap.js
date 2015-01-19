describe("Hash", function () {
  var baseLayer, map;

  beforeEach(function () {
    baseLayer = L.PolarMap.tileLayer("http://{s}.tiles.arcticconnect.org/osm_3573/{z}/{x}/{y}.png", {
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

    map = L.PolarMap.map(document.createElement('div'), {
      baseLayer: baseLayer,
      center: [90, 0],
      zoom: 2
    });
  });

  it("sets a hash on map move", function () {
    var hash = L.PolarMap.Util.hash(map, {
      getBaseLayer: function () {
        return map.options.baseLayer.options.name;
      },
      setBaseLayer: function () {}
    });
    map.setView([51.505, -0.09], 13);
    expect(location.hash).to.be('#ac_3573/13/51.5050/-0.0900');
  });

  it("loads the hash on page load");

  it("changes the hash after using an initial hash");

  it("unbinds events when removed");
});
