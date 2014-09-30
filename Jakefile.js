var build = require('./build/build.js'),
    version = require('./src/polarmap.js').version;

desc('Combine and compress PolarMap source files');
task('build', {async: true}, function (compsBase32, buildName) {
  var v;

  jake.exec('git log -1 --pretty=format:"%h"', {breakOnError: false}, function () {
    build.build(complete, v, compsBase32, buildName);

  }).on('stdout', function (data) {
    v = version + ' (' + data.toString() + ')';
  }).on('error', function () {
    v = version;
  });
});

task('default', ['build']);

jake.addListener('complete', function () {
  process.exit();
});
