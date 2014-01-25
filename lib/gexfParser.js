var sax = require("sax");

module.exports = function (content) {
  var parser = sax.parser(false, {lowercase: true});
  var events = require('ngraph.events')({});

  parser.onerror = function (e) {
    events.fire('end', e);
  };

  var tags = {
    node: {
      buff: [],
      open: function (node) {
        processNode(node, this.buff);
      },
      close: function () {
        var node = this.buff.pop();
        events.fire('node', node.id, node.data);
      }
    },
    attributes: {
      buff: [],
      open: function (node) {

      }, 
      close: function () {
        this.buff.pop();
      }
    }
  };

  parser.onopentag = function (node) {
    var handler = tags[node.name];
    if (handler) {
      handler.open(node);
    } else if (node.name === 'edge') {
      events.fire('link', node.attributes.id, node.attributes.source, node.attributes.target);
    }
  };

  parser.onclosetag = function (name) {
    if (tags[name]) {
      tags[name].close(name);
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

  function processNode(node, buffer) {
    var attributes = node.attributes;
    var id = attributes.id;
    delete attributes.id;
    buffer.push({ id: id, data: attributes });
  }
}
