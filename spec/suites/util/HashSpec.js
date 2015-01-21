describe("Hash", function () {
  var baseLayer, map;

  beforeEach(function () {
    baseLayer = L.PolarMap.layer3573;

    map = L.PolarMap.map(document.createElement('div'), {
      baseLayer: baseLayer,
      center: [90, 0],
      zoom: 2
    });
  });

  it("sets a 4-part hash on map move", function () {
    var hash = L.PolarMap.Util.hash(map, {
      getBaseLayer: function () {
        return map.options.baseLayer.options.name;
      },
      setBaseLayer: function () {}
    });
    map.setView([51.505, -0.09], 13);
    expect(location.hash).to.be('#ac_3573/13/51.5050/-0.0900');
  });

  it("sets a 3-part hash on map move (no custom base layer)", function () {
    var hash = L.PolarMap.Util.hash(map);
    map.setView([51.505, -0.09], 13);
    expect(location.hash).to.be('#13/51.5050/-0.0900');
  });

  it("loads a 4-part hash on page load", function () {
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

  it("loads a 3-part hash on page load", function () {
    location.hash = '#13/10/40';
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

  it("unbinds events when removed", function () {
    location.hash = '';
    var hash = L.PolarMap.Util.hash(map, {
      getBaseLayer: function () {
        return map.options.baseLayer.options.name;
      },
      setBaseLayer: function (name) {
        map.loadTileProjection(baseLayer);
      }
    });
    map.removeControl(hash);
    map.setView([51.505, -0.09], 13);
    expect(location.hash).to.be('');
  });
});
