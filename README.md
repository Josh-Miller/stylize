[![Build Status](https://travis-ci.org/Josh-Miller/stylize.svg)](https://travis-ci.org/Josh-Miller/stylize)

# Stylize

Stylize pattern framework. For more documentation go to [stylize.io](http://stylize.io).

## Getting Started
```
$ npm i stylize -g
```

To create a new Stylize project run `stylize init`.


## Commands

#### Initialize a new Sylize project
```
$ stylize init
```

#### Compile patterns

Compile patterns to static html

```
$ stylize compile
```
**Options:**
* --watch, -w -- Watches for file changes and recompiles on change and add.
* --path, -p -- Set the path to your Stylize project
* --output, -o -- Set an output path

#### Export patterns

Export patterns to a different system

```
$ stylize export
```
**Options:**
* --path, -p -- Set the path to your Stylize project
* --output, -o -- Set an output path

#### Regression testing

Runs visual regression testing on all patterns.

```
$ stylize regression
```
**Options:**
* --path, -p -- Set the path to your Stylize project


## Running Stylize programatically

You can easily integrate Stylize into other build processes you may be using in your current workflow. You can simply add Stylize as a dependency in your Node project `var Stylize = require('stylize');`

```
var stylize = new Stylize();

stylize.compile({projectPath: './path/to/project'});
```
