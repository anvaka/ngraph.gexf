module.exports.save = save;
module.exports.load = load;


function save() {}

function load(gexfContent, completeCb) {
  var parser = require('./lib/gexfParser')(gexfContent);
  var graph = require('ngraph.graph')();
  graph.beginUpdate();

  parser.on('node', function (id, data) {
    graph.addNode(id, data);
  }).on('link', function (id, from, to) {
    var link = graph.addLink(from, to);
    link.id = id; // gexf has own link identifiers, use that;
  }).on('end', function (err) {
    graph.endUpdate();
    completeCb(err, graph);
  });
}
