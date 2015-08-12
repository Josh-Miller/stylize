#!/usr/bin/env node

'use strict';

var program = require('commander'),
    _ = require('lodash'),
    fs = require('fs-extra'),
    chokidar = require('chokidar'),
    childProcess = require('child_process'),
    stylizeRegression = require('stylize-regression'),
    chalk = require('chalk');

// CLI
var cliCompile = require('./lib/compile'),
    cliExport = require('./lib/export'),
    cliInit = require('./lib/init'),
    cliBuild = require('./lib/build');
    // cliBuild = require('./lib/frontEnd');

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
  .action(function() {
    cliCompile.run(function() {
      log(chalk.green('Fin'));
    });
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

    stylizeRegression.get(function(patterns) {
      console.log(patterns);
    });
  });

program.parse(process.argv);


// Compile patterns
if (program.patterns) {
  cliCompile.run(function() {
    log(chalk.green('Fin'));
  });
}


// Build app
if (program.build) {
  // To run the gulp command of front end
  // childProcess.exec('cd ./core/front_end && gulp');
  cliBuild.run();
}

// Export app
if (program.export) {
  cliExport.run();
}

// Watch patterns
if (program.watch) {
  log(chalk.green('Watching'));
  var path = process.cwd();
  var watcher = chokidar.watch(path + '/src', {
    usePolling: true,
    persistent: true,
    ignored: /[\/\\]\./,
  });

  watcher.on('change', function(path, stats) {
    cliCompile.run();
    log(chalk.green('Updated', path));
  });

  watcher.on('add', function(path, stats) {
    cliBuild.run();
    cliCompile.run();
    log(chalk.green('Added', path));
  });
}
