'use strict';
let Promise = require('bluebird');
let isArray = Array.isArray;

let Post = function() {
  this.db = null;
};

Post.prototype.scheme = {
  post: {
    table: 'posts',
    indexes: [ 'slug', 'author', 'created', 'published' ]
  }
};

Post.prototype.unitInit = function(units) {
  this.db = units.require('db');
  this.table = this.scheme.post.table;

  this.nodeCtrl = units.require('resources.node.controller');
  let categories = units.require('core.settings').categories;
  if (categories) {
    this.categories = categories[this.table];
  }
};

Post.prototype.get = function(id) {
  let db = this.db;

  let q = db.table(this.table).get(id);

  q = this.mergePreview(q);
  q = this.mergeNodes(q);

  return q.run();
};

Post.prototype.getAll = function(opts) {
  return this._getAll(opts).run();
};

Post.prototype._getAll = function(opts) {
  let db = this.db;
  let r = db.r;
  let q = r.table(this.table);

  if (opts.slug) {
    q = q.getAll(opts.slug, { index: 'slug' }).orderBy(r[opts.orderByOrder || 'desc'](opts.orderByField || 'published'))
  } else {
    q = q.orderBy({
      index: r[opts.orderByOrder || 'desc'](opts.orderByField || 'published')
    });
  }

  q = this.filterDates(q, 'published', opts.published);
  q = this.filterDates(q, 'created', opts.created);
  q = this.filterStatus(q, opts.status);
  q = this.filterAuthor(q, opts.author);
  q = this.filterCategories(q, opts.categories);

  if (opts.quantity) {
    q = q.count();
  } else {
    if (opts.limit) {
      q = q.limit(opts.limit);
    }

    if (opts.preview) {
      q = this.mergePreview(q);
    }

    if (opts.content) {
      q = this.mergeNodes(q);
    } else {
      q = q.merge({
        nodes: r.row.hasFields('nodes')
      });
    }
  }

  return q;
};

Post.prototype.create = function(post) {
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

  return Promise.resolve(preview)
    .then(preview => preview ? this.nodeCtrl.create(preview) : [])
    .then(ids => {
      if (ids.length) {
        post.preview = ids[0];
      }

      return nodes ? this.nodeCtrl.create(nodes) : [];
    })
    .then(ids => {
      if (ids.length) {
        post.nodes = ids;
      }

      return this.db.insert(this.table, post);
    })
    .then(ids => {
      post.id = ids[0];

      if (post.nodes) {
        post.content = nodes.reduce(function(a, b, i) {
          a[post.nodes[i]] = b;
          return a;
        }, {});
      }

      if (preview) {
        preview.id = post.preview;
        post.preview = preview;
      }

      return post;
    });
};

Post.prototype.update = function(id, to) {
  return this.db.update(this.table, id, to);
};

Post.prototype.delete = function(id) {
  // delete nodes or not? probably yes
  return this.db.delete(this.table, id);
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

Post.prototype.filterAuthor = function(query, value) {
  if (value) {
    return query.filter(this.db.r.row('author').eq(value));
  }

  return query;
};

Post.prototype.filterCategories = function(query, value) {
  value = value === undefined ?
    [ 'all' ] : isArray(value) ? value : [ value ]

  if (!(value[0] === 'all' || value[0] === 'everything')) {
    var r = this.db.r;
    return query.filter(
      r.row('categories').contains(r.args(value))
    );
  }

  return query;
};

Post.prototype.mergePreview = function(query) {
  let r = this.db.r;
  let nodeBox = this.nodeCtrl.table;

  return query.merge(post => r.branch(
    post.hasFields('preview'),
    { preview: r.table(nodeBox).get(post('preview')) },
    {}
  ));
};

Post.prototype.mergeNodes = function(query) {
  let r = this.db.r;
  let nodeTable = this.nodeCtrl.table;

  return query.merge(post => r.branch(
    post.hasFields('nodes'),
    {
      content: post('nodes')
        .map(id => r.expr([ id, r.table(nodeTable).get(id).without('id') ]))
        .coerceTo('object')
    },
    {}
  ));
};

//nodes
Post.prototype.addPreview = function(id, node) {
  let r = this.db.r;

  return this.nodeCtrl.create(node)
    .then(ids => r.table(this.table)
      .get(id)
      .replace( r.row.merge({ preview: ids[0] }) )
      .run()
      .then(() => ids[0])
    );
};

Post.prototype.updatePreview = function(id, to) {
  return this.nodeCtrl.update(id, to);
};

Post.prototype.deletePreview = function(id, nodeId) {
  let r = this.db.r;

  return this.nodeCtrl.delete(nodeId)
    .then(() => r.table(this.table)
      .get(id)
      .replace( r.row.without('preview') )
      .run()
      .then(() => id)
    );
};

//nodes
Post.prototype.addNode = function(id, node, index) {
  let r = this.db.r;

  if (index === undefined) {
    index = -1;
  }

  return this.nodeCtrl.create(node)
    .then(ids => r.table(this.table)
      .get(id)
      .replace(function(row) {
        var nodes = r.branch(
          row.hasFields('nodes'),
          row('nodes'),
          r.expr([])
        );

        return r.branch(
          r.expr(index !== -1).and(nodes.count().gt(index)),
          row.merge({ nodes: nodes.insertAt(index, ids[0]) }),
          row.merge({ nodes: nodes.append(ids[0]) })
        );
      })
      .run()
      .then(() => ids)
  );
};

Post.prototype.updateNode = function(id, to) {
  return this.nodeCtrl.update(id, to);
};

Post.prototype.deleteNode = function(id, nodeId) {
  let r = this.db.r;

  return this.nodeCtrl.delete(nodeId)
    .then(() => r.table(this.table)
      .get(id)
      .replace(row => row.merge({ nodes: row('nodes').setDifference([ nodeId ]) }) )
      .run()
      .then(() => nodeId)
    );
};

module.exports = Post;
