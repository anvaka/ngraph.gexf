module.exports = function (xml) {
  var parser = new DOMParser();
  doc = parser.parseFromString(xml, 'text/xml');
  var ns = doc.documentElement.namespaceURI;

  return {
    selectNodes : function (name, startFrom) {
      var root = startFrom || doc;
      var xpathResult = doc.evaluate(".//x:" + name, root, nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
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
    return ns;
  }
};
