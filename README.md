# ngraph.gexf

Gephi [`gexf`](http://gexf.net/format/) file parser for server and browser. This library is a part of [ngraph](https://github.com/anvaka/ngraph) project. See demo here: [Talking with Gephi](https://github.com/anvaka/ngraph/tree/master/examples/storage/gephi)

[![Build Status](https://travis-ci.org/anvaka/ngraph.gexf.png?branch=master)](https://travis-ci.org/anvaka/ngraph.gexf)

# usage

This library allows you to load `gexf` files into [`ngraph.graph`](https://github.com/anvaka/ngraph.graph).

``` js
var fs = require('fs');
var gexf = require('ngraph.gexf');
var graph = gexf.load(fs.readFileSync('myfile.gexf', 'utf8'));
// graph is now normal grpah and can be used by ngraph modules
```

You can also store graph into `gexf` file format:
``` js
var gexf = require('ngraph.gexf');

var binTree = require('ngraph.generators').balancedBinTree(5);
var gexfFileContent = gexf.save(binTree);
```

# Details
This library supports node.js and browser runtime (via [browserify](http://browserify.org/)).
When used from node.js it uses `libxmljs` library for quick parsing of xml files.
When used in a browser it uses browser's capabilities to read and query xml files.

Because of this, library size is really small when served in the browser:

* 24kb - unminified
* 13kb - minified
* 4kb - gziped

Current implementation is really basic and does not support some of the gexf features:
* Dynamics - http://gexf.net/format/dynamics.html
* Hierarchy - http://gexf.net/format/hierarchy.html
* Phylogeny - http://gexf.net/format/phylogeny.html

Adding Hierarchy and Phylogeny is relatively easy and they will be implemented
if such need arise. Dynamics - requires to think a little bit to better represent
graph's timeline.

# install

With [npm](https://npmjs.org) do:

```
npm install ngraph.gexf
```

# license

MIT
