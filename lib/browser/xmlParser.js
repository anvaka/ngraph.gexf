/**
 * This module provide API to parse gexf XMl file in the browser. When in node.js
 * this file is not used (see ../xmlParser.js instead);
 */
module.exports = function (xml) {
  if (typeof document.evaluate === 'function') {
    return require('./nonie.js')(xml);
  }
  else {
    return require('./ie.js')(xml);
  }
}
