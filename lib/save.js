module.exports = save;

function save(graph) {
  var nodes = [];
  var links = [];
  var attributes = [];
  var uniqueAttributes = {};
  var attrIdx = 0;

  graph.forEachNode(function (node) {
    var label = (node.data && node.data.label) || '';
    if (label) {
      label = ' label="' + label + '"';
    }

    nodes.push('<node id="' + node.id + '"' + label + '>');

    if (node.data) {
      var keys = Object.keys(node.data).filter(function (attr) {
        return attr !== 'label' && supportedType(node.data[attr]);
      });
      if (keys.length > 0)  {
        nodes.push('<attvalues>');
        keys.forEach(function (key) {
          if (!uniqueAttributes.hasOwnProperty(key)) {
            attributes.push('<attribute id="' + attrIdx + '" title="' + key + '" type="' + getType(node.data[key]) + '"/>');
            uniqueAttributes[key] = attrIdx++;
          }

          // todo: this will need encoding for complex data:
          nodes.push('<attvalue for="' + uniqueAttributes[key] + '" value="' + node.data[key] + '"/>');
        });
        nodes.push('</attvalues>');
      }
    }

    nodes.push('</node>');
  });

  var linkId = 0;
  graph.forEachLink(function (link) {
    linkId += 1;
    var linkDef = '<edge id="' + linkId + '" source="' + link.fromId + '" target="' + link.toId + '"';
    if (typeof link.weight === 'number') {
      linkDef += ' weight="' + link.weight + '"';
    }

    links.push(linkDef + '/>');
  });

  var header = writeHeader();
  var attributesDef = '';
  var nodesStr = '';
  if (nodes.length > 0) {
    attributesDef = '<attributes class="node">' + attributes.join('') + '</attributes>';
    nodesStr = '<nodes>' + nodes.join('') + '</nodes>';
  }
  var edgesStr = '';
  if (links.length > 0) {
    edgesStr = '<edges>' + links.join('') + '</edges>';
  }

  return [header,
    '<graph>',
      attributesDef,
      nodesStr,
      edgesStr,
    '</graph>',
    '</gexf>'
  ].join('\n');
}

function writeHeader(){
  return [
'<?xml version="1.0" encoding="UTF-8"?>',
'<gexf xmlns="http://www.gexf.net/1.2draft" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.gexf.net/1.2draft http://www.gexf.net/1.2draft/gexf.xsd" version="1.2">',
'    <meta lastmodifieddate="' + (new Date()).toISOString().split('T')[0] + '">',
'       <creator>http://github.com/anvaka/ngraph</creator>',
'       <description>Beautiful graphs</description>',
'   </meta>'
  ].join('\n');
}

function getType(obj) {
  switch (typeof (obj)) {
    case "number" : return 'float';
    case "boolean": return 'boolean';
    default: return 'string';
  }
}

function supportedType(obj) {
  var t = typeof (obj);
  return  t === 'number' || t === 'boolean' || t === 'string';
}
