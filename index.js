'use strict';

var _ = require('lodash'),
    stylizeRegression = require('stylize-regression'),
    chalk = require('chalk'),
    path = require('path');

// CLI
var cliCompile = require('./lib/compile'),
    cliExport = require('./lib/export'),
    cliInit = require('./lib/init'),
    cliBuild = require('./lib/build');

var log = console.log.bind(console);
var projectPath = process.cwd();

var Stylize = function() {
  this.compile = function(params) {
    params.projectPath = path.join(process.cwd(), params.projectPath);
    cliCompile.run(params, function() {
      log(chalk.green('Fin'));
    });
  };

  this.export = function(projectPath) {
    projectPath = path.join(process.cwd(), projectPath);
    cliExport.run(projectPath, function() {
      log(chalk.green('Fin'));
    });
  };

  this.regression = function(projectPath) {
    projectPath = path.join(process.cwd(), projectPath);
    stylizeRegression.get(projectPath, function(patterns) {
      stylizeRegression.takeScreenshot(patterns);
    });
  };
};

module.exports = Stylize;
