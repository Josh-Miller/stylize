'use strict';

var Stylize = require('stylize-core'),
  chalk = require('chalk'),
  _ = require('lodash'),
  path = require('path');

var Export = function() {
  this.run = function(projectPath, cb) {
    console.log(chalk.green('Exporting patterns'));

    var _stylize = new Stylize;
    _stylize.path = projectPath;

    _.forEach(_stylize.config().plugins, function(n, key) {
      var settings = {};

      var plugin = require(projectPath + '/node_modules/' + key);

      if (n) {
        settings = n;
      }

      _stylize.register(key, plugin, settings);
    });

    _stylize.getPatterns(projectPath, function(patterns) {
      var patternsLength = patterns.length - 1;

      _.forEach(patterns, function(pattern, key) {

        // Compile patterns
        pattern.compiled = _stylize.compile(pattern.template, _stylize.partials, _stylize.data(pattern.name, 'export', pattern.data));

        // Compile header
        pattern.header = _stylize.compile(pattern.header, '', _stylize.data(pattern.name, '', pattern.data));

        // Compile footer
        pattern.footer = _stylize.compile(pattern.footer, '', _stylize.data(pattern.name, '', pattern.data));

        _stylize.export(pattern, function(pattern) {
          if (pattern !== undefined) {
            var dest = path.join(_stylize.path, _stylize.config().exportDestination);
            _stylize.build(dest, pattern.fileName, pattern.compiled);


          }
        });

        if (key === patternsLength) {
          cb();
        }
      });
    });
  };
};

module.exports = new Export;
