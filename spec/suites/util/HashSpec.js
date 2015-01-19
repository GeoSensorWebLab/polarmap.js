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

  it("loads the hash on page load", function () {
    location.hash = '#ac_3573/13/10/40';
    var hash = L.PolarMap.Util.hash(map, {
      getBaseLayer: function () {
        return map.options.baseLayer.options.name;
      },
      setBaseLayer: function (name) {
        map.loadTileProjection(baseLayer);
      }
    });
    window.setTimeout(function() {
        expect(Math.round(map.getCenter().lat)).to.be(10);
        expect(Math.round(map.getCenter().lng)).to.be(40);
        done();
    }, 200);
  });

  it("responds to a hash change after an initial hash is set", function () {
    map.setView([51.505, -0.09], 13);
    location.hash = '#ac_3573/13/20/40';
    var hash = L.PolarMap.Util.hash(map, {
      getBaseLayer: function () {
        return map.options.baseLayer.options.name;
      },
      setBaseLayer: function (name) {
        map.loadTileProjection(baseLayer);
      }
    });
    window.setTimeout(function() {
        expect(Math.round(map.getCenter().lat)).to.be(20);
        expect(Math.round(map.getCenter().lng)).to.be(40);
        done();
    }, 200);
  });

  it("unbinds events when removed");
});
