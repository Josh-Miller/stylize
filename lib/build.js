var Stylize = require('stylize'),
    _ = require('lodash'),
    fs = require('fs-extra'),
    chalk = require('chalk'),
    util = require('util');

var Build = function() {

  this.run = function() {
    console.log(chalk.green('Building...'));

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

      _stylize.build(path + '/public/stylizer-front-end/app/scripts/data', 'patterns.js', 'module.exports = ' + util.inspect(patterns));
    });
  }

  this.startFe = function() {
    var gulp = require('gulp');
    require('./gulpfile');

    if (gulp.tasks.test) {
        console.log('gulpfile contains task!');
        gulp.start('test');
    }
  }
}
module.exports = new Build;
