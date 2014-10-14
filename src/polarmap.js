
if (typeof(L) === "undefined") {
  var L = {};
}

L.PolarMap = {
  version: '0.4.0',
  Control: {},
  Util: {}
};

if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = L.PolarMap;
} else if (typeof define === 'function' && define.amd) {
  define(L.PolarMap);
}
