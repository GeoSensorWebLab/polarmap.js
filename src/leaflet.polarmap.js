
if (typeof(L) === "undefined") {
  L = {};
}

L.PolarMap = {
  version: '1.0.2',
  Control: {},
  Util: {}
};

if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = L.PolarMap;
} else if (typeof define === 'function' && define.amd) {
  define(L.PolarMap);
}
