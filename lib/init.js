'use strict';

var Stylize = require('stylize-core');
var env = require('yeoman-environment').createEnv();
var frontEnd = require('stylizer-front-end');
var path = require('path');

var Initialize = function() {
  this.run = function() {

    function postGenerate(err) {
      var _stylize = new Stylize;
      _stylize.path = process.cwd();
      var installPath = path.join(process.cwd(), _stylize.config().destination);
      frontEnd.init(installPath);
    }

    env.on('error', function (err) {
      console.error('Error', process.argv.slice(2).join(' '), '\n');
      console.error(opts.debug ? err.stack : err.message);
      process.exit(err.code || 1);
    });

    env.register(require.resolve('generator-stylize'), 'stylize:app');
    env.lookup(function () {
      env.run('stylize:app', postGenerate);
    });
  }
}

module.exports = new Initialize;
