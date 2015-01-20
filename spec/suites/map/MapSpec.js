describe("Map", function () {
  var map,
      baseLayer,
      baseLayer2,
      spy;

  beforeEach(function () {
    baseLayer = L.PolarMap.tileLayer("http://{s}.tiles.arcticconnect.org/osm_3573/{z}/{x}/{y}.png", {
      name: "arctic_connect@EPSG:3573",
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

    baseLayer2 = L.PolarMap.tileLayer("http://{s}.tiles.arcticconnect.org/osm_3574/{z}/{x}/{y}.png", {
      name: "arctic_connect@EPSG:3574",
      crs: "EPSG:3574",
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

  describe("#loadTileProjection", function () {
    it("returns false if the map is already changing", function () {
      map.options.changingMap = true;
      var change = map.loadTileProjection(baseLayer);
      expect(change).to.be(false);
    });

    it("does nothing if the tile projection is already loaded", function () {
      var spy = sinon.spy(map, '_dropTileLayers');

      map.loadTileProjection(baseLayer);
      expect(map._dropTileLayers.called).to.be(false);
      map._dropTileLayers.restore();
    });

    it("switches to a different tile projection", function () {
      var spy = sinon.spy(map, '_update');

      map.loadTileProjection(baseLayer2);
      expect(map._update.called).to.be(true);
      map._update.restore();
    });

    it("attempts to redraw map markers after switch", function () {
      var marker = L.marker([51.080126, -114.13380900]),
          spy = sinon.spy(marker, 'update');

      marker.addTo(map);
      map.loadTileProjection(baseLayer2);
      expect(marker.update.called).to.be(true);
      marker.update.restore();
    });

    it("attempts to redraw map shapes after switch", function () {
      var polygon = L.polyline([[51.080126, -114.13380900], [52.080126, -114.13380900]]),
          spy = sinon.spy(polygon, 'redraw');

      polygon.addTo(map);
      map.loadTileProjection(baseLayer2);
      expect(polygon.redraw.called).to.be(true);
      polygon.redraw.restore();
    });

    it("changes the map's CRS after switch", function () {
      var crs = map.options.crs;
      map.loadTileProjection(baseLayer2);
      expect(map.options.crs).to.not.be(crs);
    });

    it("preserves the map center/zoom after switch", function () {
      var center = map.getCenter(),
          zoom   = map.getZoom();
      map.loadTileProjection(baseLayer2);

      expect(map.getCenter()).to.be(center);
      expect(map.getZoom()).to.be(zoom);
    });
  });

});
