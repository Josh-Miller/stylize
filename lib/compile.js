"use strict";

var Stylize = require('stylize-core'),
    chalk = require('chalk'),
    _ = require('lodash'),
    path = require('path'),
    frontEnd = require('stylizer-front-end');

var Patterns = function() {
  this.run = function(cmdPath, cb) {
    console.log(chalk.green('Compiling patterns'));
    var _stylize = new Stylize;

    _stylize.path = cmdPath;
    var frontEndPath = _stylize.path + _stylize.config().destination;


    _.forEach(_stylize.config().plugins, function(n, key) {
      var settings = {};

      var plugin = require(cmdPath + '/node_modules/' + key);
      if (n) {
        settings = n;
      }

      _stylize.register(key, plugin, settings);
    });

    _stylize.getPatterns(cmdPath, function(patterns) {
      var patternsLength = patterns.length - 1;
      _.forEach(patterns, function(pattern, key) {

        // Compile patterns
        _stylize.compile(pattern.template, _stylize.partials, _stylize.data(pattern.name, '', pattern.data), function(compiled) {
          pattern.compiled = compiled;

          // Compile header
          _stylize.compile(pattern.header, '', _stylize.data(pattern.name, '', pattern.data), function(compiled) {
            pattern.header = compiled;

            _stylize.postCompile(pattern, function(compiled) {
              pattern.header = compiled;
              // Compile footer
              _stylize.compile(pattern.footer, '', _stylize.data(pattern.name, '', pattern.data), function(compiled) {
                pattern.footer = compiled;

                var dest = path.join(_stylize.path, _stylize.config().destination, pattern.parents.join('/'));
                _stylize.build(dest, pattern.fileName, pattern.header + pattern.compiled + pattern.footer);
                if (key === patternsLength) {
                  cb();
                }
              });
            });
          });
        });
      });
    });

    /**
     * Build front-end.
     */
    frontEnd.build({
      baseUrl: _stylize.config().baseUrl,
      dest: frontEndPath,
      patterns: _stylize.patterns,
      categories: _stylize.categories
    });
  };

  this.singlePattern = function(file, cb) {
    var fileNameArr = file.split('/');
    var fileName = _.last(fileNameArr);
    console.log(chalk.green('Compiling ' + fileName));

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

    var pattern = _stylize.createPattern(file);

    // Compile patterns
    _stylize.compile(pattern.template, _stylize.partials, _stylize.data(pattern.name), function(compiled) {
      pattern.compiled = compiled;

      // Compile header
      _stylize.compile(pattern.header, '', _stylize.data(), function(compiled) {
        pattern.header = compiled;

        _stylize.postCompile(pattern, function(compiled) {
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
    });
  }
}

module.exports = new Patterns;
