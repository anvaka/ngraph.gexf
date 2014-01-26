module.exports = function (xml) {
  var doc = new ActiveXObject('Microsoft.XMLDOM');
  doc.setProperty("SelectionLanguage", "XPath");
  doc.loadXML(xml);
  doc.setProperty("SelectionNamespaces", "xmlns:x='" + doc.documentElement.namespaceURI + "'");

  return {
    selectNodes : function (name, startFrom) {
      var ctx = startFrom || doc;
      var selectNodeResult = ctx.selectNodes(".//x:" + name);
      var result = [];
      for (var i = 0; i < selectNodeResult.length; ++i) {
        result.push(selectNodeResult[i]);
      }
      return result;
    },

    getText: function (node) {
      return node && node.text;
    }
  };
};
