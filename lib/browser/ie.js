module.exports = function (xml) {
  var doc = new ActiveXObject('Microsoft.XMLDOM');
  doc.setProperty("SelectionLanguage", "XPath");
  doc.loadXML(xml);
  var nameSpaces = require('./extracNamespaces')(doc.documentElement);

  var ns = Object.keys(nameSpaces).map(function (x) { return 'xmlns:' + x + "='" + nameSpaces[x] + "'"; }).join(' ');
  doc.setProperty("SelectionNamespaces", ns);

  return {
    selectNodes : function (name, startFrom, nsPrefix) {
      nsPrefix = nsPrefix || 'x';
      if (!nameSpaces[nsPrefix]) { return []; }

      var ctx = startFrom || doc;
      var selectNodeResult = ctx.selectNodes('.//' + nsPrefix + ':' + name);
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
