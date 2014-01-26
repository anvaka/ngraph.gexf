/**
 * This file will only be executed in node environment. When browserified
 * it will be replaced with ./browser/xmlParser.js, which leverages
 * browser's built in xpath support
 */
module.exports = function (xml) {
  var libxmljs = require("libxmljs");
  var doc = libxmljs.parseXml(xml);
  var defaultNamespace = getDefaultNamespace();

  var empty = [];

  return {
    selectNodes : function (name, startFrom) {
      var root = startFrom || doc;
      var result = root.find(".//x:" + name, { x: defaultNamespace });

      if (!result) return empty;

      result.forEach(createAttributes);

      return result;
    },

    getText: function (node) {
      return node && node.text();
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

  function getDefaultNamespace() {
    var namespaces = doc.namespaces() || [];
    for (var i = 0; i < namespaces.length; ++i) {
      var ns = namespaces[i];
      if (!ns.prefix()) {
        // this is our default namespace
        return ns.href();
      }
    }

    return 'http://www.gexf.net/1.2draft';
  }
}
