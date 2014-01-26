var test = require('tap').test,
    gexf = require('../'),
    fs = require('fs');

test('Can read basic', function (t) {
  var graph = gexf.load(fs.readFileSync(__dirname + '/data/basic.gexf', 'utf8'));

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

test('Can read data', function (t) {
  var graph = gexf.load(fs.readFileSync(__dirname + '/data/data.gexf', 'utf8'));
  t.equal(graph.getNodesCount(), 4, 'has expected number of nodes');
  t.equal(graph.getLinksCount(), 5, 'has expected number of links');

  var barabasiLab = graph.getNode('3').data;

  t.equal(barabasiLab.label, 'BarabasiLab', 'Reads label');
  t.equal(barabasiLab.url, 'http://barabasilab.com', 'Reads data');

  t.equal(barabasiLab.indegree, 1, 'Reads typed data');
  t.equal(barabasiLab.frog, false, 'Reads typed data');

  var gephi = graph.getNode('0').data;
  t.equal(gephi.frog, true, 'Respects defaults');

  t.end();
});
