var Stylize = require('stylize'),
    _ = require('lodash'),
    fs = require('fs-extra'),
    util = require('util');

var Build = function() {

  this.run = function() {
    var _stylize = new Stylize;
    var path = process.cwd();
    _stylize.path = path;

    _.forEach(_stylize.config().plugins, function(n, key) {
      var settings = {};

      var plugin = require(path + '/node_modules/' + key);
      if (n) {
        settings = n;
      }

      _stylize.register(key, plugin, settings);
    });

    _stylize.getPatterns(path, function(patterns) {

      _stylize.build(path, 'patterns.js', 'module.exports = ' + util.inspect(patterns));
    });
  }
}
module.exports = new Build;
