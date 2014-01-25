module.exports = load;

function load(gexfContent, completeCb) {
  var graph = require('ngraph.graph')();
  var attributesDef = {};

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
  }

  function addNode(node) {
    var nodeData = copyAttributes(node);
    var id = nodeData.id;
    delete nodeData.id;

    parser.selectNodes('attvalue')
          .map(copyAttributes)
          .forEach(function(attr) {
            var def = attributesDef[attr.for];
            nodeData[def.title] = attr.value;
          });

    graph.addNode(id, nodeData);
  }

  function addLink(node) {
    var attributes = copyAttributes(node);
    var link = graph.addLink(attributes.source, attributes.target);
    link.id = attributes.id;
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
