'use strict';

var env = require('yeoman-environment').createEnv();

var Initialize = function() {
  this.run = function() {

    env.on('error', function (err) {
      console.error('Error', process.argv.slice(2).join(' '), '\n');
      console.error(opts.debug ? err.stack : err.message);
      process.exit(err.code || 1);
    });

    env.register(require.resolve('generator-stylize'), 'stylize:app');
    env.lookup(function () {
      env.run('stylize:app');
    });
  }
}

module.exports = new Initialize;
