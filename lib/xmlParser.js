/**
 * This file will only be executed in node environment. When browserified
 * it will be replaced with ./browser/xmlParser.js, which leverages
 * browser's built in XPath support
 */
module.exports = function (xml) {
  var libxmljs = require("libxmljs");
  var doc = libxmljs.parseXml(xml);
  var nsMap = getNSMap();
  var empty = [];

  return {
    selectNodes : function (name, startFrom, nsPrefix) {
      nsPrefix = nsPrefix || 'x';
      if (!nsMap[nsPrefix]) { return empty; }

      var root = startFrom || doc;
      var result = root.find('.//' + nsPrefix + ':' + name, nsMap);

      if (!result) return empty;

      result.forEach(createAttributes);

      return result;
    },

    getText: function (node) {
      return node && node.text();
    }
  };

  function createAttributes(node) {
    node.nodeName = node.name();
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

  function getNSMap() {
    var namespaces = doc.namespaces() || [];
    var nsMap = {
      x: 'http://www.gexf.net/1.2draft'
    }
    for (var i = 0; i < namespaces.length; ++i) {
      var ns = namespaces[i];
      nsMap[ns.prefix() || 'x'] = ns.href();
    }

    return nsMap;
  }
}
