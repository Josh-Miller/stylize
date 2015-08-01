var Stylize = require('stylize'),
    chai = require('chai');

chai.should();

describe('Stylize CLI', function () {
  describe('compile', function() {
    it('should run compile',function(){
      var cliPatterns = require('../lib/patterns');

      cliPatterns.run(function() {
        log(chalk.green('Fin'));
      });

      expect(cliPatterns.run).to.not.throw(Error);
    });
  });


});
