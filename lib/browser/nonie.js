module.exports = function (xml) {
  var parser = new DOMParser();
  doc = parser.parseFromString(xml, 'text/xml');
  var n = extractNamespaces(doc.documentElement);
  var nameSpaces = require('./extracNamespaces')(doc.documentElement);

  return {
    selectNodes : function (name, startFrom, nsPrefix) {
      nsPrefix = nsPrefix || 'x';
      if (!nameSpaces[nsPrefix]) { return []; }

      var root = startFrom || doc;
      var xpathResult = doc.evaluate(".//" + nsPrefix + ":" + name, root, nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var result = [];

      for(var i = 0; i < xpathResult.snapshotLength; i++) {
        result.push(xpathResult.snapshotItem(i));
      }

      return result;
    },

    getText: function (node) {
      return node && node.textContent;
    }
  };

  function nsResolver(prefix) {
    return nameSpaces[prefix] || null;
  }

  function extractNamespaces(node) {
    var result = [];
    for (var i = 0; i < node.attributes.length; ++i) {
      var attr = node.attributes[i];
      if (attr.name.match(/^xmlns/)) {
        var parts = attr.name.split(':');
        var prefx = parts.length === 1 ? 'x' : parts[1];
        result.push({ prefix: prefx, href: attr.value });
      }
    }
    return result;
  }
};
