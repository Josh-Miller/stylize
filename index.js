#!/usr/bin/env node

'use strict';

var program = require('commander'),
    _ = require('lodash'),
    fs = require('fs-extra'),
    chokidar = require('chokidar'),
    childProcess = require('child_process'),
    stylizeRegression = require('stylize-regression'),
    chalk = require('chalk');

// Watch patterns
var watch = function() {
  log(chalk.green('Watching'));
  var path = process.cwd();
  var watcher = chokidar.watch(path + '/src', {
    usePolling: true,
    persistent: true,
    ignored: /[\/\\]\./,
  });

  watcher.on('change', function(path, stats) {

    cliCompile.singlePattern(path, function(fileName) {
      log(chalk.cyan('Updated', fileName));
    });
  });

  watcher.on('add', function(path, stats) {
    cliBuild.run();
    cliCompile.run(function() {
      log(chalk.green('Fin'));
    });
    log(chalk.cyan('Added', path));
  });
}

// CLI
var cliCompile = require('./lib/compile'),
    cliExport = require('./lib/export'),
    cliInit = require('./lib/init'),
    cliBuild = require('./lib/build');

var log = console.log.bind(console);

program
  .version('0.0.1')
  .option('-b, --build', 'Build app')
  .option('-e, --export', 'Export patterns');

program
  .command('init [env]')
  .description('Builds a new instance of Stylize')
  .action(function() {
    log(chalk.green('Initializing new Stylize project...'));
    cliInit.run();
  });

program
  .command('compile [env]')
  .alias('c')
  .description('Compile patterns')
  .option('-w, --watch', 'Watch and compile patterns on change')
  .action(function(env, options) {
    var mode = options.watch || false;

    if (mode) {
      watch();
    } else {
      cliCompile.run(function() {
        log(chalk.green('Fin'));
      });
    }
  });

program
  .command('build [env]')
  .alias('b')
  .description('Build Stylize app')
  .action(function() {
    var path = process.cwd();
    cliBuild.run();
  });

program
  .command('regression [env]')
  .alias('r')
  .description('Run regression test')
  .action(function() {
    var path = process.cwd();
    stylizeRegression.get(function(patterns) {
      stylizeRegression.takeScreenshot(patterns);
    });
  });

program
  .command('export [env]')
  .alias('e')
  .description('Export patterns')
  .action(function() {
    cliExport.run(function() {
      log(chalk.green('Fin'));
    });
  });

program.parse(process.argv);
