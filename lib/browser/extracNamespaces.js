module.exports = function extractNamespaces(node) {
  var result = {};
  for (var i = 0; i < node.attributes.length; ++i) {
    var attr = node.attributes[i];
    if (attr.name.match(/^xmlns/)) {
      var parts = attr.name.split(':');
      var prefx = parts.length === 1 ? 'x' : parts[1];
      result[prefx] = attr.value;
    }
  }
  return result;
};
