/*
 * L.PolarMap.Control.Rotation adds two buttons for "rotating" a map.
 */

L.PolarMap.Control.Rotation = L.Control.extend({
  options: {
    position: 'topright',
    cwText: '&orarr;',
    cwTitle: 'Rotate Clockwise',
    ccwText: '&olarr;',
    ccwTitle: 'Rotate Counter-Clockwise'
  },

  onAdd: function (map) {
    var rotationName = 'leaflet-control-rotation',
        container = L.DomUtil.create('div', rotationName + ' leaflet-bar'),
        options = this.options;

    this._cwButton  = this._createButton(options.cwText, options.cwTitle,
            rotationName + '-cw',  container, this._rotateCW);
    this._ccwButton = this._createButton(options.ccwText, options.ccwTitle,
            rotationName + '-ccw', container, this._rotateCCW);

    L.DomEvent.disableClickPropagation(container);
  	if (!L.Browser.touch) {
  		L.DomEvent.disableScrollPropagation(container);
  	}

    return container;
  },

  _rotateCW: function () {
    if (this.options.onRotateCW) {
      this.options.onRotateCW();
    }
  },

  _rotateCCW: function () {
    if (this.options.onRotateCCW) {
      this.options.onRotateCCW();
    }
  },

  _createButton: function (html, title, className, container, fn) {
    var link = L.DomUtil.create('a', className, container);
    link.innerHTML = html;
    link.href = '#';
    link.title = title;

    L.DomEvent
        .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
        .on(link, 'click', L.DomEvent.stop)
        .on(link, 'click', fn, this)
        .on(link, 'click', this._refocusOnMap, this);

    return link;
  },
});

L.PolarMap.Control.rotation = function (options) {
  return new L.PolarMap.Control.Rotation(options);
};
