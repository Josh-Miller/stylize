"use strict";

var Stylize = require('stylize-core'),
    chalk = require('chalk'),
    _ = require('lodash'),
    frontEnd = require('stylizer-front-end');

var Patterns = function() {
  this.run = function(cb) {
    console.log(chalk.green('Compiling patterns'));
    var _stylize = new Stylize;
    var path = process.cwd();
    _stylize.path = path;
    var frontEndPath = _stylize.path + _stylize.config().destination;


    _.forEach(_stylize.config().plugins, function(n, key) {
      var settings = {};

      var plugin = require(path + '/node_modules/' + key);
      if (n) {
        settings = n;
      }

      _stylize.register(key, plugin, settings);
    });

    _stylize.getPatterns(path, function(patterns) {
      var patternsLength = patterns.length - 1;
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

              var dest = _stylize.path + _stylize.config().destination + '/patterns/' + pattern.parents.join('/');
              _stylize.build(dest, pattern.fileName, pattern.header + pattern.compiled + pattern.footer);
              if (key === patternsLength) {
                cb();
              }
            });
          });
        });
      });
    });
  };

  this.singlePattern = function(file, cb) {
    var fileNameArr = file.split('/');
    var fileName = _.last(fileNameArr);
    console.log(chalk.green('Compiling ' + fileName));

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

    var pattern = _stylize.createPattern(file);

    // Compile patterns
    _stylize.compile(pattern.template, _stylize.partials, _stylize.data(pattern.name), function(compiled) {
      pattern.compiled = compiled;

      // Compile header
      _stylize.compile(pattern.header, '', _stylize.data(), function(compiled) {
        pattern.header = compiled;

        // Compile footer
        _stylize.compile(pattern.footer, '', _stylize.data(), function(compiled) {
          pattern.footer = compiled;

          var dest = _stylize.path + _stylize.config().destination + '/' + pattern.parents.join('/');
          _stylize.build(dest, pattern.fileName, pattern.header + pattern.compiled + pattern.footer);
          cb(fileName);
        });
      });
    });

    // Stub category data
    _stylize.categories = _stylize.categories || [
      {
        id: "components/blocks",
        name: "Blocks",
        weight: 0,
        parentId: "components"
      },
    ];

    /**
     * Build front-end.
     */
    frontEnd.build({
      dest: frontEndPath,
      patterns: _stylize.patterns,
      categories: _stylize.categories
    });
  }
}

module.exports = new Patterns;
