module.exports = load;

function load(gexfContent, completeCb) {
  var graph = require('ngraph.graph')();
  var attributesDef = {},
      defaultAttrValues = {};

  var parser = require('./xmlParser')(gexfContent);

  parser.selectNodes('attribute').forEach(addAttributeDef);
  parser.selectNodes('node').forEach(addNode);
  parser.selectNodes('edge').forEach(addLink);

  var links = parser
  return graph;

  function addAttributeDef(node) {
    var attr = copyAttributes(node);
    attributesDef[attr.id] = {
      title: attr.title,
      type: attr.type
    };

    parser.selectNodes('default', node).forEach(function (node) {
      var def = attributesDef[attr.id];
      addDefaultAttrValue(node, def.title, def.type);
    });
  }

  function addNode(node) {
    var nodeData = copyAttributes(node);
    var id = nodeData.id;
    delete nodeData.id;

    addNodeData(nodeData, node);
    graph.addNode(id, nodeData);
  }

  function addLink(node) {
    var attributes = copyAttributes(node);
    var link = graph.addLink(attributes.source, attributes.target);
    link.id = attributes.id;
  }

  function addNodeData(target, xmlNode) {
    // first we parse defined attriubtes on node:
    parser.selectNodes('attvalue', xmlNode)
          .forEach(function (node) {
            var attr = copyAttributes(node)
            var def = attributesDef[attr.for];
            target[def.title] = parseType(attr.value, def.type);
          });
    // second we make sure we didn't miss default values:
    for (var key in defaultAttrValues) {
      if (defaultAttrValues.hasOwnProperty(key) &&
         !target.hasOwnProperty(key)) {
        target[key] = defaultAttrValues[key];
      }
    }
  }

  function parseType(value, type) {
    switch (type) {
      case "integer":
      case "long":
      case "double":
      case "float":
        return parseFloat(value);
      case "boolean":
        return value === 'true';
    }
    return value;
  }

  function addDefaultAttrValue(node, id, type) {
    var text = parser.getText(node);
    if (text) {
      defaultAttrValues[id] = parseType(text, type);
    }
  }
}

function copyAttributes(node) {
  var attributes = {};
  for (var i = 0; i < node.attributes.length; ++i) {
    attributes[node.attributes[i].nodeName] = node.attributes[i].nodeValue;
  }

  return attributes;
}

function buildGraph(graph, doc) {
  var $ = select(doc);
  var nodes = $('gexf > graph > nodes > node');
}
