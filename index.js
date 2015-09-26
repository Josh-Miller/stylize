#!/usr/bin/env node

'use strict';

var program = require('commander'),
    _ = require('lodash'),
    fs = require('fs-extra'),
    chokidar = require('chokidar'),
    childProcess = require('child_process'),
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

// Watch patterns
var watch = function(watchDir) {
  log(chalk.green('Watching'));
  var cmdPath = process.cwd();
  var watcher = chokidar.watch(cmdPath + '/src', {
    usePolling: true,
    persistent: true,
    ignored: /[\/\\]\./,
  });

  cliCompile.run(cmdPath, function() {
    log(chalk.green('Fin'));
  });

  watcher.on('change', function(path, stats) {
    var pathArr = path.split('/');
    var fileArr = pathArr[pathArr.length - 1].split('.');
    var fileSuffix = fileArr[fileArr.length - 1];

    if (fileSuffix === 'yml') {
      console.log(chalk.cyan('Updated', fileArr));
      cliCompile.run(cmdPath, function() {
        log(chalk.green('Fin'));
      });
    } else {
      cliCompile.singlePattern(path, function(fileName) {
        log(chalk.cyan('Updated', fileName));
      });
    }

  });

  watcher.on('add', function(path, stats) {
    cliCompile.singlePattern(path, function(fileName) {
      log(chalk.cyan('Added', fileName));
    });
  });
}

program
  .version('0.0.1');

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
  .option('-p, --path [value]', 'Set the path to your Stylize project root')
  .action(function(env, options) {
    var mode = options.watch || false;

    if (mode) {
      var watchDir = {};
      watch(watchDir);
    } else {
      if (options.path) {
        projectPath = path.join(process.cwd(), options.path);
      }

      cliCompile.run(projectPath, function() {
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
  .option('-p, --path [value]', 'Set the path to your Stylize project root')
  .action(function(env, options) {
    if (options.path) {
      projectPath = path.join(process.cwd(), options.path);
    }

    stylizeRegression.get(projectPath, function(patterns) {
      stylizeRegression.takeScreenshot(patterns);
    });
  });

program
  .command('export [env]')
  .alias('e')
  .description('Export patterns')
  .option('-o, --output [value]', 'Specify an output path')
  .option('-p, --path [value]', 'Set the path to your Stylize project root')
  .action(function(env, options) {
    var output = options.output || false;

    if (options.path) {
      projectPath = path.join(process.cwd(), options.path);
    }

    cliExport.run(projectPath, function() {
      log(chalk.green('Fin'));
    });
  });

program.parse(process.argv);
