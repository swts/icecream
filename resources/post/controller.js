"use strict";
let async = require("neo-async");

let isArray = Array.isArray;

let Post = function () {
	this.db = null;
};

Post.prototype.box = "posts";
Post.prototype.scheme = { indexes: ["slug", "created", "published"] };

Post.prototype.unitInit = function (units) {
	this.db = units.require("db");
	this.nodeCtrl = units.require("resources.node.controller");

	let categories = units.require("core.settings").categories;
	if (categories) {
		this.categories = categories[this.box];
	}
};

Post.prototype.get = function(slug, options, cb) {
	if(cb === undefined) {
		cb = options;
		options = {};
	}

	let r = this.db.r;

	let q = r.table(this.box).getAll(slug, {index: "slug"});

	if (this.categories) {
		q = this.db.joinTree(q, this.categories);
	}

	q = this.filterStatus(q, options.status);
	q = this.mergeNodes(q);

	q.without("id")
		.nth(0)
		.run()
		.catch(cb)
		.then(function(res) {
			cb(null, res);
		});
};

Post.prototype.getByCategory = function(category, options, cb) {
	if(cb === undefined) {
		cb = options;
		options = {};
	}

	let r = this.db.r;
	let q = r.table(this.box).orderBy({
		index: r[options.orderByOrder || "desc"](options.orderByField || "published")
	});

	q = this.filterDates(q, "published", options.published);
	q = this.filterDates(q, "created", options.created);
	q = this.filterStatus(q, options.status);
	q = this.filterCategory(q, category);

	if (options.limit) {
		q = q.limit(options.limit);
	}

	if (this.categories) {
		q = this.db.joinTree(q, this.categories);
	}

	if(options.withContent) {
		q = this.mergeNodes(q);
	} else {
		q = q.without("nodes");
	}

	q.without("id")
		.run()
		.catch(cb)
		.then(function(res) {
			cb(null, res);
		});
};

Post.prototype.create = function (post, cb) {
	let self = this, nodes;

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
	this.db.updateSlug(this.box, slug, to, cb);
};

Post.prototype.remove = function (slug, cb) {
	// remove nodes or not???
	this.db.removeSlug(this.box, slug, cb);
};

//filters
Post.prototype.filterDates = function(query, name, value) {
	if(value) {
		if(isArray(value)) {
			return query.between(value[0], value[1], {index: name});
		} else {
			return query.filter(this.db.r.row(name).le(value));
		}
	}

	return query;
};

Post.prototype.filterStatus = function(query, value) {
	if(value !== undefined) {
		let r = this.db.r;
		return query.filter(
			r.row("status")
				.eq(value)
				.and(
					r.row("published").le(Date.now())
				)
		);
	}

	return query;
};

Post.prototype.filterCategory = function(query, value) {
	if (value !== "all" && value !== undefined) {
		return query.filter(
			this.db.r.row("categories").contains(value)
		);
	}

	return query;
};

Post.prototype.mergeNodes = function(query) {
	let r = this.db.r,
		nodeBox = this.nodeCtrl.box;
	return query.map(function(post) {
		return r.branch(
			post.hasFields("nodes"),
			post.merge({
				content: post("nodes").map(function(id) {
					return r.expr([
						id,
						r.table(nodeBox).get(id).without("id")
					]);
				}).coerceTo("object")
			}),
			post
		);
	});
};

//nodes
Post.prototype.createNode = function (slug, index, node, cb) {
	let self = this,
		r = self.db.r;

	if(index === undefined) { index = -1;}

	this.nodeCtrl.create(node, function(err, id) {
		if (err) {
			cb(err, null);
		} else {
			self.db.r.table(self.box)
				.getAll(slug, {index: "slug"})
				.replace(function(row) {
					return r.branch(
						r.expr(index !== -1).and(row("nodes").count().gt(index)),
						row.merge({nodes: row("nodes").insertAt(index, id[0])}),
						row.merge({nodes: row("nodes").append(id[0])})
					);
				})
				.run()
				.catch(cb)
				.then(function() {
					cb(null, id);
				});
		}
	});
};

Post.prototype.updateNode = function (id, to, cb) {
	this.nodeCtrl.update(id, to, cb);
};

Post.prototype.removeNode = function (slug, id, cb) {
	let self = this;

	this.nodeCtrl.remove(id, function(err) {
		if (err) {
			cb(err, null);
		} else {
			self.db.r.table(self.box)
				.getAll(slug, {index: "slug"})
				.replace( function(row) {
					return row.merge({nodes: row("nodes").setDifference([id])});
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
