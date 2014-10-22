window.PolarMap = L.Class.extend({
  options: {
    geosearch: false,
    locate: false,
    permalink: true
  },

  statics: {
    VERSION: L.PolarMap.version
  },

  initialize: function (id, options) {

  }
});

window.polarMap = function (id, options) {
  return new PolarMap(id, options);
};
