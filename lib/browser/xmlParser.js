module.exports = function (xml) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(xml, 'text/xml');

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
    var ns = {
      'x' : 'http://www.gexf.net/1.2draft',
    };
    return ns[prefix] || null;
  }
}
