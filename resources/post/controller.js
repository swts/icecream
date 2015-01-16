"use strict";
var async = require('async');

var isArray = Array.isArray;

var Post = function () {
	this.db = null;
};

Post.prototype.box = "posts";
Post.prototype.scheme = { indexes: ["slug", "created", "published"] };

Post.prototype.unitInit = function (units) {
	this.db = units.require('db');
	this.nodeCtrl = units.require('resources.node.controller');

	var categories = units.require("core.settings").categories;
	if (categories) {
		this.categories = categories[this.box];
	}
};

Post.prototype.get = function(slug, options, cb) {
	if(cb === undefined) {
		cb = options;
		options = {};
	}

	var self = this,
		r = this.db.r,
		now = Date.now(),
		query = {
			box: this.box,
			get: slug,
			index: "slug"
		},
		ql = [
			{exclude: "id"},
			{map: function(post) {
				return r.branch(
					post.hasFields("nodes"),
					post.merge({
						content: post("nodes").map(function(id) {
							return r.expr([
								id,
								r.table(self.nodeCtrl.box).get(id).without("id")
							]);
						}).coerceTo("object")
					}),
					post
				);
			}},
			{nth: 0}
		];

	if(options.status !== undefined) {
		query.filter = function(row) {
			return row('status').eq(options.status).and(row("published").le(now));
		};
	}

	if (this.categories) {
		self.db.joinTree(query, this.categories, ql, cb);
	} else {
		self.db.query(query, ql, cb);
	}
};

Post.prototype.getByCategory = function(category, options, cb) {
	if(cb === undefined) {
		cb = options;
		options = {};
	}

	var self = this,
		r = this.db.r,
		filter,
		now = Date.now(),
		query = {
			box: this.box
		},
		ql = [
			{ orderBy: this.db.r[options.orderByOrder || "desc"](options.orderByField ||  "published") },
			{ exclude: "id" }
		],
		callback = function(err, result) {
			if(err) {
				cb(err);
			} else {
				result.toArray(cb);
			}
		};

	if(options.withContent) {
		ql.push({map: function(post) {
				return r.branch(
					post.hasFields("nodes"),
					post.merge({
						content: post("nodes").map(function(id) {
							return r.expr([
								id,
								r.table(self.nodeCtrl.box).get(id).without("id")
							]);
						}).coerceTo("object")
					}),
					post
				);
			}
		});
	} else {
		ql.push({exclude: "nodes"});
	}

	if (category !== "all" && category !== undefined) {
		query.filter = function(row) {
			return row('categories').contains(category);
		};
	}

	if (options.status) {
		ql.unshift({
			filter: function(row) {
				return row('status').eq(options.status).and(row("published").le(now));
			}
		});
	}

	if (options.created) {
		if(isArray(options.created)) {
			query.between = [options.created[0], options.created[1], {index: "created"}];
		} else {
			ql.unshift({
				filter: function(row) {
					return row('created').le(options.created);
				}
			});
		}
	}

	if (options.published) {
		if(isArray(options.published)) {
			query.between = [options.published[0], options.published[1], {index: "published"}];
		} else {
			ql.unshift({
				filter: function(row) {
					return row('published').le(options.published);
				}
			});
		}
	}

	if (options.limit) {
		ql.push({
			limit: options.limit
		});
	}

	if (this.categories) {
		this.db.joinTree(query, this.categories, ql, callback);
	} else {
		this.db.query(query, ql, callback);
	}
};

Post.prototype.create = function (post, cb) {
	var self = this, nodes;

	if(!post.status) { post.status = "draft"; }
	if(!post.created) { post.created = Date.now(); }
	if(!post.published) { post.published = post.created;}

	if(post.content) {
		nodes = post.content;
		delete post.content;
	}

	async.waterfall([
		function (cb) {
			if(nodes) {
				self.db.insert(self.nodeCtrl.box, nodes, cb);
			} else {
				cb(null, []);
			}
		},

		function (ids, cb) {
			if(ids) {
				post.nodes = ids;
			}

			self.db.insert(self.box, post, function(err, result) {
				if(err) {
					cb(err);
				} else {
					post.id = result[0];

					if(post.nodes) {
						post.content = ids.reduce(function(a, b, i) {
							a[b] = nodes[i];
							return a;
						}, {});
					}

					cb(null, post);
				}
			});
		}
	], cb);
};

Post.prototype.update = function (slug, to, cb) {
	this.db.update(this.box, slug, to, cb);
};

Post.prototype.remove = function (slug, cb) {
	// remove nodes or not???
	this.db.remove(this.box, slug, cb);
};

Post.prototype.createNode = function (slug, index, node, cb) {
	var self = this,
		r = self.db.r;

	if(index === undefined) { index = -1;}

	this.nodeCtrl.create(node, function(err, id) {
		if (err) {
			cb(err, null);
		} else {
			self.db.query({
				box: self.box,
				get: slug,
				index: "slug"
			},[{
				replace: function(row) {
					return r.branch(
						r.expr(index !== -1).and(row("nodes").count().gt(index)),
						row.merge({nodes: row("nodes").insertAt(index, id[0])}),
						row.merge({nodes: row("nodes").append(id[0])})
					);
				}
			}], function (err, result) {
				if(err) {
					cb(err);
				} else {
					cb(null, id);
				}
			});
		}
	});
};

Post.prototype.updateNode = function (id, to, cb) {
	this.nodeCtrl.update(id, to, cb);
};

Post.prototype.removeNode = function (slug, id, cb) {
	var self = this;

	this.nodeCtrl.remove(id, function(err, result) {
		if (err) {
			cb(err, null);
		} else {
			self.db.query({
				box: self.box,
				get: slug,
				index: "slug"
			},
			[{
				replace: function(row) {
					return row.merge({nodes: row("nodes").setDifference([id])});
				}
			}], cb);
		}
	});
};

module.exports = Post;
