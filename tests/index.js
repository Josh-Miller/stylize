var Stylize = require('stylize'),
    chai = require('chai');

chai.should();

describe('Stylize CLI', function () {
  describe('compile', function() {
    it('should run compile',function(){
      var cliCompile = require('../lib/compile');

      cliCompile.run(function() {
        log(chalk.green('Fin'));
      });

      expect(cliCompile.run).to.not.throw(Error);
    });
  });


});
