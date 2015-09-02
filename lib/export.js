"use strict";

var Stylize = require('stylize-core'),
    chalk = require('chalk'),
    _ = require('lodash');

var Export = function() {
  this.run = function(cmdPath, cb) {
    console.log(chalk.green('Exporting patterns'));

    var _stylize = new Stylize;
    _stylize.path = cmdPath;

    _.forEach(_stylize.config().plugins, function(n, key) {
      var settings = {};

      var plugin = require(cmdPath + '/node_modules/' + key);

      if (n) {
        settings = n;
      }

      _stylize.register(key, plugin, settings);
    });

    _stylize.getPatterns(cmdPath, function(patterns) {

      _.forEach(patterns, function(pattern, key) {

        // Compile patterns
        _stylize.compile(pattern.template, _stylize.partials, _stylize.data(pattern.name, 'export'), function(compiled) {
          pattern.compiled = compiled;

          // Compile header
          _stylize.compile(pattern.header, '', _stylize.data(), function(compiled) {
            pattern.header = compiled;

            // Compile footer
            _stylize.compile(pattern.footer, '', _stylize.data(), function(compiled) {
              pattern.footer = compiled;

              _stylize.export(pattern, function() {
                cb();
              });
            });
          });
        });
      });
    });
  }
}

module.exports = new Export;
