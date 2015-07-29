var Stylize = require('../compiler/stylize.js'),
    _ = require('lodash'),
    Pattern = require('../compiler/pattern'),
    fs = require('fs-extra'),
    util = require('util'),
    Files = require('../files');

var Frontend = function() {

  this.run = function() {
    var _stylize = new Stylize;

    _.forEach(_stylize.config().plugins, function(n, key) {
      var settings = {};

      var plugin = require('../../plugins/' + key);
      if (n) {
        settings = n;
      }

      _stylize.register(key, plugin, settings);
    });

    _stylize.getPatterns(function(patterns) {

      _stylize.build(__dirname + '/../front_end/app/scripts/sg/services', 'patterns.js', 'module.exports = ' + util.inspect(patterns));
    });
  }
}
module.exports = new Frontend;
