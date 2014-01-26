// since our code needs to be test both in node and browser,
// we help mocha to look in browsers same as tap in node
if (typeof test !== 'undefined') {
  var mochaRunner = test;
  module.exports = function (name, test) {
    mochaRunner(name, function (t) {
      var assert = require('assert');
      assert.end = function() {
        t();
      }
      test(assert);
    });
  }
} else {
  module.exports = require('tap').test;
}
