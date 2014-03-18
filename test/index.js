var gexf = require('../'),
    assert = require('assert'),
    fs = require('fs'),
    test = require('./testShim');

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

test('Reads link weights', function (t) {
  var graph = gexf.load(fs.readFileSync(__dirname + '/data/weights.gexf', 'utf8'));

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
    t.equal(link.weight, 2.4);
  });

  t.end();
});

test('Always use strings as ids', function (t) {
  var graph = gexf.load(fs.readFileSync(__dirname + '/data/strings.gexf', 'utf8'));

  t.equal(graph.getNodesCount(), 2, 'has two nodes');
  t.equal(graph.getLinksCount(), 1, 'has one link');
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

test('Can read both id and for for attributes', function (t) {
  // looks like some apps are using 'id' instead of 'for' to map their attributes
  // let's check we support it
  var graph = gexf.load(fs.readFileSync(__dirname + '/data/attrAsId.gexf', 'utf8'));
  t.equal(graph.getNodesCount(), 2, 'has expected number of nodes');
  t.equal(graph.getLinksCount(), 0, 'has expected number of links');

  var gephi = graph.getNode('0').data;

  t.equal(gephi.label, 'Gephi', 'Reads label');
  t.equal(gephi.url, 'http://gephi.org', 'Reads data');

  var webatlas = graph.getNode('1').data;
  t.equal(webatlas.label, 'Webatlas', 'Reads data');
  t.equal(webatlas.url, 'http://webatlas.fr', 'Reads data');

  t.end();
});

test('Can read viz data', function (t) {
  var graph = gexf.load(fs.readFileSync(__dirname + '/data/viz.gexf', 'utf8'));
  t.equal(graph.getNodesCount(), 1, 'has expected number of nodes');
  t.equal(graph.getLinksCount(), 0, 'has expected number of links');

  var glossy = graph.getNode('a').data;

  t.equal(glossy.label, 'glossy', 'Reads label');
  var color = glossy.viz.color;
  var position = glossy.viz.position;
  t.equal(glossy.viz.shape, 'disc', 'reads viz shape');
  t.equal(glossy.viz.size, 2.42, 'reads size');

  t.end();
});

test('can save graph', function (t) {
  var graph = gexf.load(fs.readFileSync(__dirname + '/data/data.gexf', 'utf8'));
  var saved = gexf.save(graph);
  var reloaded = gexf.load(saved);
  t.equal(reloaded.getNodesCount(), graph.getNodesCount(), 'Reloaded and saved has the same number of nodes');
  t.equal(reloaded.getLinksCount(), graph.getLinksCount(), 'Reloaded and saved has the same number of links');

  graph.forEachNode(function (node) {
    var other = reloaded.getNode(node.id);
    t.equal(other.id, node.id, 'Loaded node id is the same');
    for (var key in node.data) {
      t.equal(other.data[key], node.data[key], 'Loaded node label is the same');
    }
  });

  t.end();
});

test('can save ngraph.graph', function (t) {
  var graph = require('ngraph.graph')();
  var link = graph.addLink("1", "2");
  link.weight = 10;
  var saved = gexf.save(graph);
  var reloaded = gexf.load(saved);

  t.equal(reloaded.getNodesCount(), graph.getNodesCount(), 'Reloaded and saved has the same number of nodes');
  t.equal(reloaded.getLinksCount(), graph.getLinksCount(), 'Reloaded and saved has the same number of links');

  graph.forEachNode(function (node) {
    var other = reloaded.getNode(node.id);
    t.equal(other.id, node.id, 'Loaded node id is the same');
  });
  var other = reloaded.hasLink("1", "2");
  t.equal(other.weight, link.weight);

  t.end();
});

