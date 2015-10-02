'use strict';

var Stylize = require('stylize-core'),
    chalk = require('chalk'),
    _ = require('lodash'),
    path = require('path'),
    frontEnd = require('stylize-front-end');

var Patterns = function() {

  this.run = function(params, cb) {
    console.log(chalk.green('Compiling patterns'));
    var _stylize = new Stylize;
    var cmdPath = params.projectPath;

    _stylize.path = cmdPath;
    var frontEndPath = _stylize.path + _stylize.config().destination;

    // Register Plugins
    _stylize.getPlugins();

    _stylize.getPatterns(cmdPath, function(patterns) {
      var patternsLength = patterns.length - 1;
      _.forEach(patterns, function(pattern, key) {

        // Compile patterns
        pattern.compiled = _stylize.compile(pattern.template, _stylize.partials, _stylize.data(pattern.name, '', pattern.data));

        // Compile header
        pattern.header = _stylize.compile(pattern.header, '', _stylize.data(pattern.name, '', pattern.data));

        // Compile footer
        pattern.footer = _stylize.compile(pattern.footer, '', _stylize.data(pattern.name, '', pattern.data));

        // PostCompile
        pattern.header = _stylize.postCompile(pattern);

        var patternsDest = (params.output ? params.output : _stylize.config().destination);
        var dest = path.join(_stylize.path, patternsDest, 'patterns', pattern.parents.join('/'));
        _stylize.build(dest, pattern.fileName, pattern.header + pattern.compiled + pattern.footer);
        if (key === patternsLength) {
          cb();
        }
      });
    });

    /**
     * Build front-end.
     */
    frontEnd.build({
      baseUrl: _stylize.config().baseUrl || '/',
      dest: frontEndPath,
      patterns: _stylize.patterns,
      categories: _stylize.categories
    });
  };

  this.singlePattern = function(params, cb) {
    var file = params.file;
    var fileNameArr = file.split('/');
    var fileName = _.last(fileNameArr);
    console.log(chalk.green('Compiling ' + fileName));

    var _stylize = new Stylize;
    var cmdPath = process.cwd();
    _stylize.path = cmdPath;
    var frontEndPath = _stylize.path + _stylize.config().destination;

    // Register Plugins
    _stylize.getPlugins();

    var pattern = _stylize.createPattern(file);

    // Compile patterns
    pattern.compiled = _stylize.compile(pattern.template, _stylize.partials, _stylize.data(pattern.name, '', pattern.data));

    // Compile header
    pattern.header = _stylize.compile(pattern.header, '', _stylize.data(pattern.name, '', pattern.data));

    // Compile footer
    pattern.footer = _stylize.compile(pattern.footer, '', _stylize.data(pattern.name, '', pattern.data));

    // PostCompile
    pattern.header = _stylize.postCompile(pattern);

    var patternsDest = (params.output ? params.output : _stylize.config().destination);
    var dest = path.join(_stylize.path, patternsDest, 'patterns', pattern.parents.join('/'));

    _stylize.build(dest, pattern.fileName, pattern.header + pattern.compiled + pattern.footer);
    cb(fileName);
  }
}

module.exports = new Patterns;
