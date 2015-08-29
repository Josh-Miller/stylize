var Stylize = require('stylize-core'),
    chai = require('chai'),
    fs = require('fs-extra');

var expect = chai.expect;

describe('Stylize CLI', function () {
  describe('compile', function() {
    it('should run compile',function(){
      var cliCompile = require('../lib/compile');

      cliCompile.run(__dirname, function(err) {
        expect(err).to.be.undefined;
      });

      after(function() {
        // Clean up /public created files
        fs.removeSync(__dirname + '/public');
      });
    });
  });

  describe('export', function() {
    it('should run export',function(){
      var cliExport = require('../lib/export');

      cliExport.run(__dirname, function(err) {
        expect(err).to.be.undefined;
      });

      after(function() {
        // Clean up /public created files
        fs.removeSync(__dirname + '/public');
      });
    });
  });

});
