var test = require('tap').test,
    gexf = require('../'),
    fs = require('fs');

test('Can read data', function (t) {
  gexf.load(fs.readFileSync(__dirname + '/data/basic.gexf', 'utf8'), function (err, graph) {
    t.ok(err === undefined, 'No error');
    t.equal(graph.getNodesCount(), 2, 'has two nodes');
    t.equal(graph.getLinksCount(), 1, 'has one link');

    var hello = graph.getNode('0');
    var world = graph.getNode('1');

    t.equal(hello.data.label, 'Hello', 'Reads label');
    t.equal(world.data.label, 'World', 'Reads label');

    graph.forEachLink(function (link) {
      t.equal(link.fromId, '0');
      t.equal(link.toId, '1');
      t.equal(link.id, '0');
    });

    t.end();
  });
});
