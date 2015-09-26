"use strict";

var Stylize = require('stylize-core'),
    chalk = require('chalk'),
    _ = require('lodash');

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

      _.forEach(patterns, function(pattern, key) {

        // Compile patterns
        pattern.compiled = _stylize.compile(pattern.template, _stylize.partials, _stylize.data(pattern.name, 'export', pattern.data));

        // Compile header
        pattern.header = _stylize.compile(pattern.header, '', _stylize.data(pattern.name, '', pattern.data));

        // Compile footer
        pattern.footer = _stylize.compile(pattern.footer, '', _stylize.data(pattern.name, '', pattern.data));

        _stylize.export(pattern, function() {
          cb();
        });

      });
    });
  }
}

module.exports = new Export;
