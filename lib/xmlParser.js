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

      if (result) {
        result.forEach(function (node) {
          node.attributes = node.attrs().map(function (a) {
            return {
              nodeName: a.name(),
              nodeValue: a.value()
            };
          });
        })
      }
      return result || empty;
    },
    getText: function (node) {
      return node && node.text();
      /* browser should do: 
      if (node.firstChild) {
      }
      */
    }
  };
}
