var sax = require("sax");

module.exports = function (content) {
  var parser = sax.parser(false, {lowercase: true});
  var events = require('ngraph.events')({});

  parser.onerror = function (e) {
    events.fire('end', e);
  };

  parser.onopentag = function (node) {
    if (node.name === 'node') {
      var attributes = node.attributes;
      var id = attributes.id;
      delete attributes.id;
      events.fire('node', id, attributes);
    } else if (node.name === 'edge') {
      events.fire('link', node.attributes.id, node.attributes.source, node.attributes.target);
    }
  };

  parser.onend = function () {
    events.fire('end');
  }

  setTimeout(function() {
    parser.write(content);
    parser.end();
  });

  return events;
}
