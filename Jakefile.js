var build = require('./build/build.js'),
    version = require('./src/leaflet.polarmap.js').version;

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

desc('Serve example demo files');
task('server', function () {
  jake.exec('node node_modules/.bin/http-server . -a 127.0.0.1 --cors', {
    printStdout: true,
    printStderr: true
  });
});

watchTask(['build'], function () {
  this.watchFiles.include([
    './src/**/*.js'
  ]);
});

desc('Run PhantomJS tests');
task('test', {async: true}, function () {
  build.test(complete);
});

task('default', ['build']);
