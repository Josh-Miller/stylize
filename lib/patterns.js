var Stylize = require('stylize'),
    _ = require('lodash');

var Patterns = function() {
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

      _.forEach(patterns, function(pattern, key) {

        // Compile patterns
        _stylize.compile(pattern.template, _stylize.partials, _stylize.data(pattern.name), function(compiled) {
          pattern.compiled = compiled;

          // Compile header
          _stylize.compile(pattern.header, '', _stylize.data(), function(compiled) {
            pattern.header = compiled;

            // Compile footer
            _stylize.compile(pattern.footer, '', _stylize.data(), function(compiled) {
              pattern.footer = compiled;

              var dest = __dirname + '/../../' + _stylize.config().destination + '/' + pattern.parents.join('/');
              _stylize.build(dest, pattern.fileName, pattern.header + pattern.compiled + pattern.footer);
            });
          });
        });
      });
    });
  }
}

module.exports = new Patterns;
