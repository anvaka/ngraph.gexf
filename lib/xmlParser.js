module.exports = function (xml) {
  var dom = require('xmldom').DOMParser;
  var doc = new dom().parseFromString(xml);
  var select = require('xpath.js');

  return {
    selectNodes : function (name, startFrom) {
      return select(startFrom || doc, "//*[local-name()='" + name + "']");
    }
  }
}
