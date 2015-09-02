var handlebars = require('handlebars'),
    _ = require('lodash');

var stylizeHandlebars = function(pattern) {

  var self = {
    extend: '_compile',
    init: function(pattern, cb) {
      handlebars.registerHelper('renderPHP', function(data){
        var output = data;

        if (output) {
          return new handlebars.SafeString(output);
        } else {
          return '';
        }

      });

      _.forEach(pattern.partials, function(n, key) {
        handlebars.registerPartial(key, n);
      });
      var template = handlebars.compile(pattern.template);

      return template(pattern.data);
    }
  }

  return self;
}


module.exports = stylizeHandlebars();
