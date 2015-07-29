#!/usr/bin/env node

'use strict';

var program = require('commander'),
    _ = require('lodash'),
    fs = require('fs-extra'),
    chokidar = require('chokidar'),
    childProcess = require('child_process'),
    chalk = require('chalk');

// CLI
var cliPatterns = require('./lib/patterns'),
    cliExport = require('./lib/export');
    // cliBuild = require('./lib/frontEnd');
    // cliBuild = require('./lib/build');
var log = console.log.bind(console);

program
  .version('0.0.1')
  .option('-b, --build', 'Build app')
  .option('-p, --patterns', 'Compile patterns')
  .option('-w, --watch', 'Watch and compile patterns on change')
  .option('-e, --export', 'Export patterns');

program
  .command('init [env]')
  .description('Builds a new instance of Stylize')
  .action(function() {
    log(chalk.green('Initializing new Stylize project...'));
  });

program.parse(process.argv);


// Compile patterns
if (program.patterns) {
  cliPatterns.run();
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
  var watcher = chokidar.watch(__dirname + '/src', {
    usePolling: true,
    persistent: true,
    ignored: /[\/\\]\./,
  });

  watcher.on('change', function(path, stats) {
    cliPatterns.run();
    log(chalk.green('Updated', path));
  });

  watcher.on('add', function(path, stats) {
    cliBuild.run();
    cliPatterns.run();
    log(chalk.green('Added', path));
  });
}
