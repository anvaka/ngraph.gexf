var createGraph = require('ngraph.graph');
var streamingSVGParser = require('streaming-svg-parser');

module.exports = load;

function load(gexfContent) {
  var allGraphs = [];
  var graph;
  var globalNodeAttributes, globalEdgeAttributes;
  var defaultAttrValues;
  var currentNode, currentEdge;

  var parseText = streamingSVGParser.createStreamingSVGParser(onTagOpen, onTagClose);
  parseText(gexfContent);

  return allGraphs[0];

  function onTagOpen(el) {
    if (el.tagName === 'graph') addGraph(el);
    if (el.tagName === 'node') addNode(el);
    if (el.tagName === 'edge') addEdge(el);
  }

  function onTagClose(el) {
    if (el.tagName === 'attributes') parseGlobalAttributes(el);
    else if (el.tagName === 'attvalues') addToCurrent(el);
    else if (el.tagName === 'node') closeCurrent(el);
    else if (el.tagName === 'edge') closeCurrent(el);
    else if (el.tagName.startsWith('viz') && currentNode) addNodeViz(currentNode, el);
  }

  function parseGlobalAttributes(el) {
    if (!graph) throw new Error('Cannot add global attributes before graph is defined');

    var attributes;
    if (el.attributes.get('class') === 'node') {
      globalNodeAttributes = [];
      attributes = globalNodeAttributes;
    } else {
      globalEdgeAttributes = [];
      attributes = globalEdgeAttributes;
    }

    el.children.forEach(child => {
      if (child.tagName !== 'attribute') return;
      var id = child.attributes.get('id');
      if (id === undefined) throw new Error('Attribute id is required');

      var title = child.attributes.get('title');
      if (title === undefined) throw new Error('Attribute title is required');

      var type = child.attributes.get('type');

      var defaultValue = undefined;
      child.children.forEach(grandChild => {
        if (grandChild.tagName === 'default') {
          defaultValue = parseType(grandChild.innerText, type);
        }
      })
      attributes.push({id: id, title: title, type: type, defaultValue: defaultValue});
    })
  }

  function addNodeViz(node, el) {
    var vizPropertyName = el.tagName.substring(4); // strip 'viz:' prefix
    if (!node.data) node.data = Object.create(null);
    if (!node.data.viz) node.data.viz = Object.create(null);
    var viz = node.data.viz;
    var attributeValues = copyAttributes(el);
    if ('value' in attributeValues && Object.keys(attributeValues).length === 1) {
      viz[vizPropertyName] = attributeValues.value;
    } else {
      viz[vizPropertyName] = attributeValues;
    }
  }

  function closeCurrent(el) {
    currentNode = null;
    currentEdge = null;
  }

  function addToCurrent(el) {
    if (currentNode && currentEdge) {
      throw new Error('Cannot add attribute to both node and edge. Parser has an error');
    }

    if (currentNode) {
      addDataToElement(currentNode, el, globalNodeAttributes);
    } else if (currentEdge) {
      addDataToElement(currentEdge, el, globalEdgeAttributes);
    }
  }

  function addDataToElement(graphElement, xmlElement, attributesDef) {
    if (!attributesDef) {
      throw new Error('No attributes defined in the file yet. Is this expected?');
    }

    if (!graphElement.data) graphElement.data = Object.create(null);

    var localOverrides = new Map();
    xmlElement.children.forEach(attributeDefinition => {
      var readFrom = attributeDefinition.attributes;
      var forId = readFrom.get('for') || readFrom.get('id');
      var value = readFrom.get('value');
      localOverrides.set(forId, value);
    });

    attributesDef.forEach(globalAttribute => {
      var title = globalAttribute.title;
      var id = globalAttribute.id;

      graphElement.data[title] = localOverrides.has(id) ? 
                    parseType(localOverrides.get(id), globalAttribute.type) : 
                    globalAttribute.defaultValue;
    })
  }

  function addGraph(el) {
    graph = createGraph();
    allGraphs.push(graph);
  }

  function addNode(el) {
    var id = el.attributes.get('id');
    if (id === undefined) {
      throw new Error('Node must have id');
    }
    currentNode = graph.addNode(id, copyAttributes(el));
  }

  function addEdge(el) {
    var from = el.attributes.get('source');
    var to = el.attributes.get('target');
    if (from === undefined || to === undefined) {
      throw new Error('Edge must have source and target');
    }
    currentEdge = graph.addLink(from, to, copyAttributes(el));
  }

  function copyAttributes(el) {
    var attributes = Object.create(null);
    el.attributes.forEach((value, key) => {
      attributes[key] = value;
    });

    return attributes;
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
}