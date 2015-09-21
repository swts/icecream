'use strict';
let async = require('neo-async');

let isArray = Array.isArray;

let Post = function() {
  this.db = null;
};

Post.prototype.box = 'posts';
Post.prototype.scheme = { indexes: [ 'slug', 'created', 'published' ] };

Post.prototype.unitInit = function(units) {
  this.db = units.require('db');
  this.nodeCtrl = units.require('resources.node.controller');

  let categories = units.require('core.settings').categories;
  if (categories) {
    this.categories = categories[this.box];
  }
};

Post.prototype.get = function(id, options, cb) {
  if (cb === undefined) {
    cb = options;
    options = {};
  }

  let db = this.db;

  let q = db.table(this.box).get(id);

  if (this.categories) {
    q = db.joinTree(q, this.categories);
  }

  q = this.filterStatus(q, options.status);
  q = this.mergePreview(q);
  q = this.mergeNodes(q);


  db.run(q, cb);
};

Post.prototype.getBySlug = function(slug, options, cb) {
  if (cb === undefined) {
    cb = options;
    options = {};
  }

  let db = this.db;

  let q = db.table(this.box).getAll(slug, { index: 'slug' });

  if (this.categories) {
    q = db.joinTree(q, this.categories);
  }

  q = this.filterStatus(q, options.status);
  q = this.mergePreview(q);
  q = this.mergeNodes(q);

  db.run(q, cb);
};

Post.prototype.getByCategories = function(categories, options, cb) {
  if (cb === undefined) {
    cb = options;
    options = {};
  }

  let db = this.db;
  let r = db.r;
  let q = r.table(this.box).orderBy({
    index: r[options.orderByOrder || 'desc'](options.orderByField || 'published')
  });

  q = this.filterDates(q, 'published', options.published);
  q = this.filterDates(q, 'created', options.created);
  q = this.filterStatus(q, options.status);
  q = this.filterCategories(q, isArray(categories) ? categories : [ categories ] );

  if (options.limit) {
    q = q.limit(options.limit);
  }

  if (this.categories) {
    q = db.joinTree(q, this.categories);
  }

  if (options.preview) {
    q = this.mergePreview(q);
  }

  if (options.content) {
    q = this.mergeNodes(q);
  } else {
    q = q.merge({
      nodes: r.row.hasFields('nodes')
    });
  }

  db.run(q, cb);
};

Post.prototype.create = function(post, cb) {
  let self = this;
  let nodes;
  let preview;

  if (!post.status) {
    post.status = 'draft';
  }
  if (!post.created) {
    post.created = Date.now();
  }
  if (!post.published) {
    post.published = post.created;
  }

  if (post.preview) {
    preview = post.preview;
    delete post.preview;
  }

  if (post.content) {
    nodes = post.content;
    delete post.content;
  }

  async.waterfall([
    function(cb1) {
      if (preview) {
        self.db.insert(self.nodeCtrl.box, preview, cb1);
      } else {
        cb1(null, []);
      }
    },

    function(previewId, cb2) {
      if (previewId.length) {
        post.preview = previewId[0];
      }

      if (nodes) {
        self.db.insert(self.nodeCtrl.box, nodes, cb2);
      } else {
        cb2(null, []);
      }
    },

    function(nodeIds, cb3) {
      if (nodeIds.length) {
        post.nodes = nodeIds;
      }
      self.db.insert(self.box, post, function(err, result) {
        if (err) {
          cb3(err);
        } else {
          post.id = result[0];

          if (post.nodes) {
            post.content = nodes.reduce(function(a, b, i) {
              a[nodeIds[i]] = b;
              return a;
            }, {});
          }

          if (preview) {
            preview.id = post.preview;
            post.preview = preview;
          }

          cb3(null, post);
        }
      });
    }
  ], cb);
};

Post.prototype.update = function(id, to, cb) {
  this.db.update(this.box, id, to, cb);
};

Post.prototype.remove = function(id, cb) {
  // remove nodes or not? probably yes
  this.db.remove(this.box, id, cb);
};

//filters
Post.prototype.filterDates = function(query, name, value) {
  if (value) {
    if (isArray(value)) {
      return query.between(value[0], value[1], { index: name });
    } else {
      return query.filter(this.db.r.row(name).le(value));
    }
  }

  return query;
};

Post.prototype.filterStatus = function(query, value) {
  if (value !== undefined) {
    let r = this.db.r;
    return query.filter(
      r.row('status')
        .eq(value)
        .and(
          r.row('published').le(Date.now())
        )
    );
  }

  return query;
};

Post.prototype.filterCategories = function(query, value) {
  if (!(value[0] === 'all' || value[0] === 'everything' || value[0] === undefined)) {
    var r = this.db.r;
    return query.filter(
      r.row('categories').contains(r.args(value))
    );
  }

  return query;
};

Post.prototype.mergePreview = function(query) {
  let r = this.db.r;
  let nodeBox = this.nodeCtrl.box;

  return query.merge(function(post) {
    return r.branch(
      post.hasFields('preview'),
      {
        preview: r.table(nodeBox).get(post('preview'))
      },
      {}
    );
  });
};

Post.prototype.mergeNodes = function(query) {
  let r = this.db.r;
  let nodeBox = this.nodeCtrl.box;

  return query.merge(function(post) {
    return r.branch(
      post.hasFields('nodes'),
      {
        content: post('nodes').map(function(id) {
            return r.expr([
              id,
              r.table(nodeBox).get(id).without('id')
            ]);
          }).coerceTo('object')
      },
      {}
    );
  });
};

//nodes
Post.prototype.createPreview = function(id, node, cb) {
  let self = this;
  let r = self.db.r;

  this.nodeCtrl.create(node, function(err, nodeIds) {
    if (err) {
      cb(err, null);
    } else {
      r.table(self.box)
        .get(id)
        .replace( r.row.merge({ preview: nodeIds[0] }) )
        .run()
        .catch(cb)
        .then(function() {
          cb(null, nodeIds[0]);
        });
    }
  });
};

Post.prototype.updatePreview = function(id, nodeId, to, cb) {
  this.nodeCtrl.update(nodeId, to, cb);
};

Post.prototype.removePreview = function(id, nodeId, cb) {
  let self = this;
  let r = this.db.r;

  this.nodeCtrl.remove(id, function(err) {
    if (err) {
      cb(err, null);
    } else {
      r.table(self.box)
        .get(id)
        .replace( r.row.without('preview') )
        .run()
        .catch(cb)
        .then(function(res) {
          cb(null, res);
        });
    }
  });
};

//nodes
Post.prototype.createNode = function(id, index, node, cb) {
  let self = this;
  let r = self.db.r;

  if (index === undefined) {
    index = -1;
  }

  this.nodeCtrl.create(node, function(err, nodeIds) {
    if (err) {
      cb(err, null);
    } else {
      r.table(self.box)
        .get(id)
        .replace(function(row) {
          var nodes = r.branch(
            row.hasFields('nodes'),
            row('nodes'),
            r.expr([])
          );

          return r.branch(
            r.expr(index !== -1).and(nodes.count().gt(index)),
            row.merge({ nodes: nodes.insertAt(index, nodeIds[0]) }),
            row.merge({ nodes: nodes.append(nodeIds[0]) })
          );
        })
        .run()
        .catch(cb)
        .then(function() {
          cb(null, nodeIds);
        });
    }
  });
};

Post.prototype.updateNode = function(id, nodeId, to, cb) {
  this.nodeCtrl.update(nodeId, to, cb);
};

Post.prototype.removeNode = function(id, nodeId, cb) {
  let self = this;
  let r = this.db.r;

  this.nodeCtrl.remove(nodeId, function(err) {
    if (err) {
      cb(err, null);
    } else {
      r.table(self.box)
        .get(id)
        .replace( function(row) {
          return row.merge({ nodes: row('nodes').setDifference([ nodeId ]) });
        })
        .run()
        .catch(cb)
        .then(function(res) {
          cb(null, res);
        });
    }
  });
};

module.exports = Post;
