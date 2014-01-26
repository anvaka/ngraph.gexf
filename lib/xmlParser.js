module.exports = function (xml) {
  var libxmljs = require("libxmljs");
  var doc = libxmljs.parseXml(xml);

  var empty = [];

  return {
    selectNodes : function (name, startFrom) {
      var root = startFrom || doc;
      var result = root.find(".//x:" + name, {
        x: 'http://www.gexf.net/1.2draft'
      });

      if (!result) return empty;

      result.forEach(createAttributes);

      return result;
    },

    getText: function (node) {
      return node && node.text();
      /* browser should do: 
      if (node.firstChild) {
      }
      */
    }
  };

  function createAttributes(node) {
    if (node.attributes !== undefined) { return; }
    // node's libxml does not have 'attributes' object, let's create them:
    node.attributes = node.attrs().map(extractAttribute);
  }

  function extractAttribute(a) {
    return {
      nodeName: a.name(),
      nodeValue: a.value()
    };
  }
}
